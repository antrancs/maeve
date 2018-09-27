<template>
  <div v-if="currentPlaying" class="player-bar-wrapper">
    <div class="player-bar">
      <div class="player-bar__left">
        <div class="player-bar__song-name long-text-truncated">{{ songName }}</div>
        <div class="player-bar__artist-name long-text-truncated">{{ artistName }}</div>
      </div>

      <div class="flex-column player-bar__center">
        <div class="player-bar__controls group-control">
          <button class="btn btn--icon" @click="handleBackwardClicked">
            <icon name="backward" class="icon icon--l"></icon>
          </button>

          <button class="btn btn--icon" @click="toggleCurrentTrack">
            <icon :name="songStatusIcon" class="icon icon--xl"></icon>
          </button>
          
          <button class="btn btn--icon" @click="handleForwardClicked">
            <icon name="forward" class="icon icon--l"></icon>
          </button>
        </div>

        <div class="flex-row player-bar__progress group-control">
          <div>{{ currentPlaybackTimeInMilliSeconds | formattedDuration }}</div>
          <div class="progress-bar">
            <div class="progress-bar__current-progress" :style="{ width: playbackProgress * 100 + '%' }"></div>
          </div>
          <div>{{ currentPlaying.playbackDuration | formattedDuration }}</div>
        </div>
      </div>

      <div class="player-bar__right flex-row">
        <button class="btn btn--icon" @click="$emit('song-queue-icon-clicked')">
          <icon name="list" class="icon"></icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';

import 'vue-awesome/icons/backward';
import 'vue-awesome/icons/forward';
import 'vue-awesome/icons/list';
import 'vue-awesome/icons/pause-circle';
import 'vue-awesome/icons/play-circle';
import 'vue-awesome/icons/random';
import 'vue-awesome/icons/redo';
import 'vue-awesome/icons/volume-up';

import { MusicPlayerState } from '@/store/types';
import {
  PLAY_NEXT,
  PLAY_PREVIOUS,
  TOGGLE_CURRENT_TRACK
} from '@/store/actions.type';
import { Nullable } from '@/@types/model/model';

@Component
export default class PlayerBar extends Vue {
  // State
  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: Nullable<MusicKit.MediaItem>;
  @State(state => state.musicPlayer.isPlaying)
  isPlaying!: boolean;
  @State(state => state.musicPlayer.playbackProgress)
  playbackProgress!: number;
  @State(state => state.musicPlayer.currentPlaybackTimeInMilliSeconds)
  currentPlaybackTimeInMilliSeconds!: number;

  // Action
  @Action
  [PLAY_NEXT]: () => void;
  @Action
  [PLAY_PREVIOUS]: () => void;
  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;

  // Computed
  get songStatusIcon(): string {
    return this.isPlaying ? 'pause-circle' : 'play-circle';
  }

  get artistName(): string {
    return this.currentPlaying ? this.currentPlaying.artistName : '';
  }

  get songName(): string {
    return this.currentPlaying ? this.currentPlaying.title : '';
  }

  // Methods
  handleForwardClicked() {
    this.playNext();
  }

  handleBackwardClicked() {
    this.playPrevious();
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_player-bar.scss';
</style>
