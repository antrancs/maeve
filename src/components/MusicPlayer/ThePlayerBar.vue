<template>
  <PlayerFullScreen>
    <div
      v-if="musicPlayer.currentPlaying"
      :class="['secondary', $style['wrapper']]"
    >
      <v-layout row fill-height>
        <img
          v-if="currentTrackArtwork"
          :class="['hidden-xs-only', $style['song-artwork']]"
          :src="currentTrackArtwork"
          alt="Song artwork"
        />
        <v-flex fill-height>
          <v-layout column fill-height>
            <PlayerProgressBar />
            <v-layout row align-center class="mx-2">
              <v-flex
                xs8
                sm8
                md3
                :class="{ 'pr-2': $vuetify.breakpoint.xsOnly }"
                :style="primaryStyle"
              >
                <div
                  :class="[$style['song-name'], 'long-text-truncated', 'mb-1']"
                >
                  {{ songName }}
                </div>
                <ResourceLinkList
                  :class="['long-text-truncated', $style['link-item']]"
                  :resources="artists"
                  :name="artistName"
                />
              </v-flex>

              <v-flex xs4 sm4 md4>
                <v-layout
                  row
                  align-center
                  :justify-center="$vuetify.breakpoint.mdAndUp"
                  :justify-end="$vuetify.breakpoint.smAndDown"
                  :class="{
                    [$style['btn-groups-small-device']]:
                      $vuetify.breakpoint.xsOnly
                  }"
                >
                  <v-btn
                    v-if="$vuetify.breakpoint.mdAndUp"
                    icon
                    @click.stop="handleShuffleClicked"
                    title="Shuffle"
                  >
                    <v-icon
                      medium
                      :style="primaryStyle"
                      :color="shuffleIconColor"
                      >shuffle</v-icon
                    >
                  </v-btn>
                  <PlayPreviousButton v-if="$vuetify.breakpoint.mdAndUp" />
                  <PlayButton :size="50" />
                  <PlayNextButton />

                  <v-btn
                    v-if="$vuetify.breakpoint.mdAndUp"
                    icon
                    @click.stop="updateRepeatMode"
                    title="Repeat"
                  >
                    <v-icon
                      medium
                      :color="repeatIconColor"
                      :style="primaryStyle"
                      >{{ repeatIcon }}</v-icon
                    >
                  </v-btn>
                </v-layout>
              </v-flex>

              <v-flex md5 v-if="$vuetify.breakpoint.mdAndUp">
                <v-layout row align-center justify-end>
                  <LyricsDialog v-if="isAuthenticated">
                    <v-btn small round outline color="accent">Lyrics</v-btn>
                  </LyricsDialog>
                  <div :style="secondaryTextStyle">
                    {{
                      musicPlayer.currentPlaybackTimeInMilliSeconds
                        | formattedDuration
                    }}
                    /
                    <span>
                      {{ currentPlayingDuration | formattedDuration }}
                    </span>
                  </div>

                  <PlayerVolume :width="110" />

                  <v-btn icon @click.stop="toggleQueueVisibility">
                    <v-icon medium :style="primaryStyle">playlist_play</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </PlayerFullScreen>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { State, Action, Getter, Mutation } from 'vuex-class';

import LyricsDialog from '@/components/LyricsDialog.vue';
import ResourceLinkList from '@/components/ResourceLinkList.vue';
import PlayerProgressBar from './PlayerProgressBar.vue';
import PlayerFullScreen from './PlayerFullScreen.vue';
import PlayNextButton from './PlayNextButton.vue';
import PlayPreviousButton from './PlayPreviousButton.vue';
import PlayButton from './PlayButton.vue';
import PlayerVolume from './PlayerVolume.vue';
import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import { MusicPlayerState } from '@/store/types';
import {
  TOGGLE_QUEUE_VISIBILITY,
  UPDATE_REPEAT_MODE,
  TOGGLE_SHUFFLE_MODE
} from '@/store/actions.type';
import { Nullable, ShuffleMode, Artist } from '@/@types/model/model';
import { RepeatMode, PLACEHOLDER_IMAGE } from '@/utils/constants';
import { getArtworkUrl } from '@/utils/utils';

@Component({
  components: {
    LyricsDialog,
    PlayerProgressBar,
    PlayNextButton,
    PlayPreviousButton,
    PlayButton,
    PlayerVolume,
    PlayerFullScreen,
    ResourceLinkList
  }
})
export default class PlayerBar extends Mixins(PlayerBarColorMixin) {
  private playerFullScreenVisible = false;
  @State musicPlayer!: MusicPlayerState;

  @Getter currentPlayingDuration!: number;
  @Getter isAuthenticated!: boolean;

  @Action
  [UPDATE_REPEAT_MODE]: () => void;
  @Action
  [TOGGLE_QUEUE_VISIBILITY]: () => void;
  @Action
  [TOGGLE_SHUFFLE_MODE]: () => void;

  get artistName(): string {
    if (
      !this.musicPlayer.currentPlaying ||
      !this.musicPlayer.currentPlaying.attributes
    ) {
      return '';
    }
    return this.musicPlayer.currentPlaying.attributes.artistName;
  }

  get artists(): Nullable<Artist[]> {
    const { currentPlaying } = this.musicPlayer;
    if (
      !currentPlaying ||
      !currentPlaying.relationships ||
      !currentPlaying.relationships.artists
    ) {
      return null;
    }

    return currentPlaying.relationships.artists.data;
  }

  get songName(): string {
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

  get repeatIconColor(): string {
    return this.musicPlayer.repeatMode !== RepeatMode.Off ? 'accent' : '';
  }

  get shuffleIconColor(): string {
    return this.musicPlayer.shuffleMode === ShuffleMode.On ? 'accent' : '';
  }

  get currentTrackArtwork() {
    if (
      !this.musicPlayer.currentPlaying ||
      !this.musicPlayer.currentPlaying.attributes
    ) {
      return PLACEHOLDER_IMAGE;
    }

    return getArtworkUrl(
      this.musicPlayer.currentPlaying.attributes.artwork.url,
      120,
      120
    );
  }

  handleShuffleClicked() {
    this.toggleShuffleMode();
  }
}
</script>

<style lang="scss" module>
@import '@/styles/components/_link-item.scss';
.wrapper {
  border-top: 0.1rem solid black;
  bottom: 0;
  height: $player-bar-height;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 5;
}

.song-artwork {
  height: $player-bar-height;
  width: $player-bar-height;
}

.song-name {
  font-weight: bold;
}

.btn-groups-small-device button {
  margin: 0;
}
</style>

<style lang="scss">
.progress-bar-wrapper:not(.progress-bar-mouse-over) .v-slider__thumb {
  display: none;
}
</style>
