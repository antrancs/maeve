<template>
  <v-dialog
    v-model="dialog"
    v-if="musicPlayer.currentPlaying"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <slot slot="activator"></slot>
    <v-card class="secondary">
      <v-layout row wrap>
        <v-flex xs12>
          <v-btn icon :dark="darkMode" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>

        <v-flex xs12 v-if="musicPlayer.currentPlaying && dialog">
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm12 md6>
                <v-layout column wrap align-center>
                  <ArtworkSlide
                    :direction="artworkSlideDirection"
                    :artworkSize="artworkSize"
                  />

                  <PlayerProgressBar class="mt-3" />

                  <v-layout row justify-space-between style="width: 100%">
                    <div :style="secondaryTextStyle">
                      {{
                        musicPlayer.currentPlaybackTimeInMilliSeconds
                          | formattedDuration
                      }}
                    </div>

                    <div :style="secondaryTextStyle">
                      {{ currentPlayingDuration | formattedDuration }}
                    </div>
                  </v-layout>

                  <v-flex :class="['long-text-truncated', 'mb-1', 'song-name']">
                    {{ songName }}
                  </v-flex>
                  <v-flex
                    :class="['long-text-truncated', 'artist-name']"
                    :style="secondaryTextStyle"
                  >
                    {{ artistName }}
                  </v-flex>
                </v-layout>

                <v-layout row justify-center align-center>
                  <PlayPreviousButton
                    :size="40"
                    @on-previous="artworkSlideDirection = 'left'"
                  />
                  <PlayButton :size="80" />
                  <PlayNextButton
                    :size="40"
                    @on-next="artworkSlideDirection = 'right'"
                  />
                </v-layout>

                <PlayerVolume />

                <v-divider></v-divider>
                <v-flex class="text-xs-center my-2">
                  <app-button
                    :color="shuffleButtonColor"
                    @on-click="toggleShuffleMode"
                    :style="shuffleButtonTextColor"
                  >
                    <v-icon left>shuffle</v-icon>Shuffle
                  </app-button>

                  <app-button
                    :color="buttonColor"
                    @on-click="updateRepeatMode"
                    :style="buttonTextColor"
                  >
                    <v-icon left>{{ repeatIcon }}</v-icon
                    >Repeat
                  </app-button>
                </v-flex>

                <v-divider></v-divider>

                <v-expansion-panel popout v-if="$vuetify.breakpoint.smAndDown">
                  <v-expansion-panel-content class="secondary">
                    <div slot="header"><h3>Lyrics</h3></div>
                    <v-card class="secondary">
                      <v-card-text style="white-space: pre-wrap;">{{
                        lyrics
                      }}</v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <h2 class="my-2">Play Queue</h2>
                <YourQueue />
                <PlayQueueUpNext />
              </v-flex>

              <v-flex
                md6
                class="px-4 text-xs-center"
                v-if="$vuetify.breakpoint.mdAndUp"
              >
                <h2>Lyrics</h2>
                <template v-if="isAuthenticated">
                  <div v-if="lyrics.length > 0" style="white-space: pre-wrap;">
                    {{ lyrics }}
                  </div>
                  <v-progress-circular
                    v-else
                    :width="3"
                    color="accent"
                    indeterminate
                  ></v-progress-circular>
                </template>

                <div v-else>Lyrics are available when log in</div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import YourQueue from '@/components/PlayQueue/YourQueue.vue';
import PlayQueueUpNext from '@/components/PlayQueue/PlayQueueUpNext.vue';
import MediaArtwork from '@/components/MediaArtwork.vue';
import PlayNextButton from './PlayNextButton.vue';
import PlayPreviousButton from './PlayPreviousButton.vue';
import PlayButton from './PlayButton.vue';
import ArtworkSlide from './ArtworkSlide.vue';
import PlayerProgressBar from './PlayerProgressBar.vue';
import PlayerVolume from './PlayerVolume.vue';
import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import LyricsMixin from '@/mixins/LyricsMixin';
import { MusicPlayerState } from '@/store/types';
import { Watch } from 'vue-property-decorator';
import { RepeatMode, PLACEHOLDER_IMAGE } from '@/utils/constants';
import { UPDATE_REPEAT_MODE, TOGGLE_SHUFFLE_MODE } from '@/store/actions.type';
import {
  Song,
  Nullable,
  ShuffleMode,
  PlayQueueSong
} from '@/@types/model/model';
import { TEXT_PRIMARY_DARK, TEXT_PRIMARY_LIGHT } from '@/themes';
import { getArtworkUrl } from '@/utils/utils';

@Component({
  components: {
    MediaArtwork,
    PlayerProgressBar,
    PlayNextButton,
    PlayPreviousButton,
    PlayButton,
    PlayerVolume,
    ArtworkSlide,
    YourQueue,
    PlayQueueUpNext
  }
})
export default class PlayerFullScreen extends Mixins(
  PlayerBarColorMixin,
  LyricsMixin
) {
  private dialog = false;
  private artworkSlideDirection = 'right';

  @State
  musicPlayer!: MusicPlayerState;

  @Getter currentPlayingDuration!: number;
  @Getter isAuthenticated!: boolean;
  @Getter darkMode!: boolean;

  @Action
  [UPDATE_REPEAT_MODE]: () => void;
  @Action
  [TOGGLE_SHUFFLE_MODE]: () => void;

  @Watch('dialog')
  onDialogVisibilityChanged(newValue: boolean) {
    if (newValue) {
      this.$_fetchLyrics();
    }
  }

  @Watch('musicPlayer.currentPlaying')
  onCurrentPlayingChanged(newValue: PlayQueueSong) {
    if (newValue && this.dialog) {
      this.$_fetchLyrics();
    }
  }

  get artworkSize() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 250;
      case 'sm':
        return 500;
      case 'xl':
        return 400;
      default:
        return 300;
    }
  }

  get artistName() {
    if (
      !this.musicPlayer.currentPlaying ||
      !this.musicPlayer.currentPlaying.attributes
    ) {
      return '';
    }
    return this.musicPlayer.currentPlaying.attributes.artistName;
  }

  get songName() {
    if (
      !this.musicPlayer.currentPlaying ||
      !this.musicPlayer.currentPlaying.attributes
    ) {
      return '';
    }
    return this.musicPlayer.currentPlaying.attributes.name;
  }

  get repeatIcon(): string {
    return this.musicPlayer.repeatMode === RepeatMode.One
      ? 'repeat_one'
      : 'repeat';
  }

  get buttonColor(): string {
    return this.musicPlayer.repeatMode === RepeatMode.Off
      ? 'primary lighten-2'
      : 'accent';
  }

  get shuffleButtonColor(): string {
    return this.musicPlayer.shuffleMode === ShuffleMode.Off
      ? 'primary lighten-2'
      : 'accent';
  }

  get buttonTextColor() {
    let textColor: string;

    if (!this.darkMode && this.musicPlayer.repeatMode === RepeatMode.Off) {
      textColor = TEXT_PRIMARY_LIGHT;
    } else {
      textColor = TEXT_PRIMARY_DARK;
    }
    return {
      color: textColor
    };
  }

  get shuffleButtonTextColor() {
    let textColor: string;

    if (!this.darkMode && this.musicPlayer.shuffleMode === ShuffleMode.Off) {
      textColor = TEXT_PRIMARY_LIGHT;
    } else {
      textColor = TEXT_PRIMARY_DARK;
    }
    return {
      color: textColor
    };
  }

  open() {
    this.dialog = true;
  }

  $_fetchLyrics() {
    this.lyrics = '';

    if (
      this.isAuthenticated &&
      this.musicPlayer.currentPlaying &&
      this.musicPlayer.currentPlaying.attributes
    ) {
      this.fetchLyrics(
        this.musicPlayer.currentPlaying.attributes.name,
        this.musicPlayer.currentPlaying.attributes.artistName
      );
    }
  }
}
</script>

<style lang="scss" scoped>
.artwork-wrapper {
  max-height: 30rem;
  /* transition: width 0.25s ease-out; */
  max-width: 30rem;
  width: 50%;
  transition: transform 0.3s ease-in-out;
  display: flex;

  align-items: flex-end;
}

.artwork-wrapper.playing {
  transform: scale(1.1);
}

.song-name {
  font-size: 2.2rem;
  font-weight: bold;
}

.artist-name {
  font-size: 2rem;
}

.song-artwork {
  width: 50%;
}
</style>
