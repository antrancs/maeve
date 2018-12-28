<template>
  <div
    v-if="musicPlayer.currentPlaying"
    :class="['secondary', $style['wrapper']]"
  >
    <v-layout row fill-height>
      <img
        v-if="currentTrackArtwork && currentTrackArtwork.length > 0"
        :class="$style['song-artwork']"
        :src="currentTrackArtwork"
        alt="Song artwork"
      />
      <v-flex fill-height>
        <v-layout column fill-height>
          <v-flex
            @mouseover="progressBarMouseOver = true"
            @mouseleave="progressBarMouseOver = false"
            @mouseup="handleMouseUp"
            @mousemove="mouseMove = true"
          >
            <v-slider
              :class="[
                'mt-0',
                $style['progress-bar'],
                'progress-bar-wrapper',
                { 'progress-bar-mouse-over': progressBarMouseOver }
              ]"
              min="0"
              max="100"
              height="0"
              v-model="playbackProgress"
              :color="$vuetify.theme.accent"
            >
            </v-slider>
          </v-flex>

          <v-flex style="margin-top: -20px">
            <v-layout row align-center class="mx-2">
              <v-flex md4>
                <div
                  :class="[$style['song-name'], 'long-text-truncated', 'mb-1']"
                >
                  {{ songName }}
                </div>
                <div class="long-text-truncated">{{ artistName }}</div>
              </v-flex>

              <v-flex md4>
                <v-layout row align-center justify-center>
                  <v-btn icon @click="playPrevious">
                    <v-icon dark medium>skip_previous</v-icon>
                  </v-btn>

                  <v-btn
                    icon
                    @click="toggleCurrentTrack"
                    style="width: 5rem; height: 5rem"
                  >
                    <v-icon dark size="50">{{ songStatusIcon }}</v-icon>
                  </v-btn>

                  <v-btn icon @click="playNext">
                    <v-icon medium dark>skip_next</v-icon>
                  </v-btn>

                  <v-btn icon @click="updateRepeatMode">
                    <v-icon medium dark :color="repeatIconColor">{{
                      repeatIcon
                    }}</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>

              <v-flex md4>
                <v-layout row align-center justify-end>
                  <div class="sub-info-text">
                    {{
                      musicPlayer.currentPlaybackTimeInMilliSeconds
                        | formattedDuration
                    }}
                    / <span> {{ playbackDuration | formattedDuration }} </span>
                  </div>

                  <v-btn icon class="mr-1">
                    <v-icon medium>volume_up</v-icon>
                  </v-btn>

                  <div style="width: 100px">
                    <v-slider
                      min="0"
                      max="1"
                      step="0.1"
                      v-model="volume"
                      color="white"
                    >
                    </v-slider>
                  </div>

                  <v-btn icon @click="toggleQueueVisibility">
                    <v-icon medium>playlist_play</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter, Mutation } from 'vuex-class';

import { MusicPlayerState } from '@/store/types';
import {
  PLAY_NEXT,
  PLAY_PREVIOUS,
  TOGGLE_CURRENT_TRACK,
  TOGGLE_SHUFFLE_MODE,
  TOGGLE_QUEUE_VISIBILITY,
  SEEK_TO_TIME,
  CHANGE_VOLUME,
  UPDATE_REPEAT_MODE
} from '@/store/actions.type';
import { Nullable } from '@/@types/model/model';
import { RepeatMode } from '@/utils/constants';

@Component
export default class PlayerBar extends Vue {
  private progressBarMouseOver = false;
  private progressBarValue = 0;
  private mouseUp = false;
  private mouseMove = false;

  @State musicPlayer!: MusicPlayerState;

  @Getter
  isAuthenticated!: boolean;
  @Getter currentTrackArtwork!: string;

  @Action
  [PLAY_NEXT]: () => void;
  @Action
  [PLAY_PREVIOUS]: () => void;
  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;
  @Action
  [TOGGLE_SHUFFLE_MODE]: () => void;
  @Action
  [UPDATE_REPEAT_MODE]: () => void;
  @Action [SEEK_TO_TIME]: (time: number) => void;
  @Action [CHANGE_VOLUME]: (volume: number) => void;
  @Action
  [TOGGLE_QUEUE_VISIBILITY]: () => void;

  get playbackProgress(): number {
    return this.$store.state.musicPlayer.playbackProgress * 100;
  }

  set playbackProgress(value: number) {
    this.progressBarValue = value;

    if (this.mouseUp && this.musicPlayer.currentPlaying) {
      this.mouseUp = false;
      this.setTime();
    }
  }

  get volume(): number {
    return this.musicPlayer.volume;
  }

  set volume(value: number) {
    this.changeVolume(value);
  }

  get songStatusIcon(): string {
    return this.musicPlayer.isPlaying ? 'pause' : 'play_arrow';
  }

  get artistName(): string {
    return this.musicPlayer.currentPlaying
      ? this.musicPlayer.currentPlaying.artistName
      : '';
  }

  get songName(): string {
    return this.musicPlayer.currentPlaying
      ? this.musicPlayer.currentPlaying.title
      : '';
  }

  get repeatIcon(): string {
    return this.musicPlayer.repeatMode === RepeatMode.One
      ? 'repeat_one'
      : 'repeat';
  }

  get repeatIconColor(): string {
    return this.musicPlayer.repeatMode !== RepeatMode.Off ? 'accent' : '';
  }

  get playbackDuration(): number {
    if (!this.musicPlayer.currentPlaying) {
      return 0;
    }
    return this.isAuthenticated
      ? this.musicPlayer.currentPlaying.playbackDuration
      : 30000; // 30 seconds
  }

  handleShuffleClicked() {
    this.toggleShuffleMode();
  }

  handleMouseUp() {
    this.mouseUp = true;
    if (this.mouseMove) {
      this.mouseMove = false;
      this.setTime();
    }
  }

  setTime() {
    const time = (this.playbackDuration / 1000) * (this.progressBarValue / 100);
    this.seekToTime(time);
  }
}
</script>

<style lang="scss" module>
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
</style>

<style lang="scss">
.progress-bar-wrapper:not(.progress-bar-mouse-over) .v-slider__thumb {
  display: none;
}
</style>
