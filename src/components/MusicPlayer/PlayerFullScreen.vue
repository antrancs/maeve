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
          <v-btn icon dark @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>

        <v-flex xs12 v-if="musicPlayer.currentPlaying && dialog">
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm12 md6>
                <v-layout column wrap align-center>
                  <div
                    v-if="$vuetify.breakpoint.mdAndDown"
                    class="artwork-wrapper mb-3"
                    :class="{ playing: musicPlayer.isPlaying }"
                  >
                    <img
                      v-if="currentTrackArtwork"
                      :class="['song-artwork']"
                      :src="currentTrackArtwork"
                      :style="artworkStyle"
                      alt="Song artwork"
                    />
                  </div>

                  <PlayingVisualization
                    v-else
                    :artworkUrl="currentTrackArtwork"
                    :size="playingVisualizationSize"
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
                    {{ musicPlayer.currentPlaying.title }}
                  </v-flex>
                  <v-flex
                    :class="['long-text-truncated', 'artist-name']"
                    :style="secondaryTextStyle"
                  >
                    {{ musicPlayer.currentPlaying.artistName }}
                  </v-flex>
                </v-layout>

                <v-layout row justify-center align-center>
                  <PlayPreviousButton :size="40" />
                  <PlayButton :size="80" />
                  <PlayNextButton :size="40" />
                </v-layout>

                <PlayerVolume />

                <v-divider></v-divider>
                <v-flex class="text-xs-center my-2">
                  <app-button :color="buttonColor" @on-click="updateRepeatMode">
                    <v-icon dark left>{{ repeatIcon }}</v-icon
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
                <SongListSmall :tracks="queuedSongs" :is-queue="true" />
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

import MediaArtwork from '@/components/MediaArtwork.vue';
import AppButton from '@/components/AppButton.vue';
import PlayNextButton from './PlayNextButton.vue';
import PlayPreviousButton from './PlayPreviousButton.vue';
import PlayButton from './PlayButton.vue';
import PlayingVisualization from './PlayingVisualization.vue';
import PlayerProgressBar from './PlayerProgressBar.vue';
import PlayerVolume from './PlayerVolume.vue';
import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import LyricsMixin from '@/mixins/LyricsMixin';
import SongListSmall from '@/components/SongListSmall.vue';
import { MusicPlayerState } from '@/store/types';
import { Watch } from 'vue-property-decorator';
import { RepeatMode } from '@/utils/constants';
import { UPDATE_REPEAT_MODE } from '@/store/actions.type';
import { Song, Nullable } from '@/@types/model/model';

@Component({
  components: {
    MediaArtwork,
    PlayerProgressBar,
    PlayNextButton,
    PlayPreviousButton,
    PlayButton,
    AppButton,
    PlayerVolume,
    SongListSmall,
    PlayingVisualization
  }
})
export default class PlayerFullScreen extends Mixins(
  PlayerBarColorMixin,
  LyricsMixin
) {
  private dialog = false;

  @State
  musicPlayer!: MusicPlayerState;
  @State(state => state.playQueue.songs)
  queuedSongs!: Song[];

  @Getter currentPlayingDuration!: number;
  @Getter currentTrackArtwork!: Nullable<string>;
  @Getter isAuthenticated!: boolean;

  @Action
  [UPDATE_REPEAT_MODE]: () => void;

  @Watch('dialog')
  onDialogVisibilityChanged(newValue: boolean) {
    if (newValue && this.musicPlayer.currentPlaying) {
      this.lyrics = '';

      if (this.isAuthenticated) {
        this.$_fetchLyrics(
          this.musicPlayer.currentPlaying.title,
          this.musicPlayer.currentPlaying.artistName
        );
      }
    }
  }

  @Watch('musicPlayer.currentPlaying')
  onCurrentPlayingChanged(newValue: MusicKit.MediaItem) {
    if (newValue && this.dialog && this.musicPlayer.currentPlaying) {
      this.lyrics = '';

      if (this.isAuthenticated) {
        this.$_fetchLyrics(
          this.musicPlayer.currentPlaying.title,
          this.musicPlayer.currentPlaying.artistName
        );
      }
    }
  }

  // get artworkWrapperWidthStyle() {
  //   return {
  //     width: this.musicPlayer.isPlaying ? '50%' : '40%'
  //   };
  // }

  get playingVisualizationSize() {
    return this.$vuetify.breakpoint.xsOnly ? 300 : 450;
  }

  get artworkStyle() {
    if (!this.currentTrackArtwork) {
      return {};
    }
    return {
      'box-shadow': '0.2rem 0.2rem 1rem #ffffff'
    };
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

  open() {
    this.dialog = true;
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
  width: 100%;
}
</style>
