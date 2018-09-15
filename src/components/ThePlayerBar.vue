<template>
  <div v-if="musicPlayer.currentPlaying" class="player-bar-wrapper">
    <div class="player-bar">
      <div class="player-bar__left">
        <div class="player-bar__artist-name ">{{musicPlayer.currentPlaying.name}}</div>
        <div class="player-bar__song-name">{{musicPlayer.currentPlaying.artistName}}</div>
      </div>

      <div class="player-bar__center ">
        <div class="player-bar__controls">
          <icon name="redo" class="icon"></icon>
          <span @click="handleBackwardClicked">
            <icon name="backward" class="icon"></icon>
          </span>

          <span @click="toggleCurrentTrack">
            <icon
              :name="songStatusIcon"
              class="icon icon--large"
            >
            </icon>
          </span>

          <span @click="handleForwardClicked">
            <icon name="forward" class="icon">
            </icon>
          </span>

          <icon name="random" class="icon"></icon>
        </div>

        <div>
          <progress class="player-bar__progress-bar"
            max="100" :value="musicPlayer.playbackProgress * 100"
          >
            {{musicPlayer.playbackProgress * 100}}
          </progress>
        </div>
      </div>

      <div class="player-bar__right">
        <icon name="volume-up" class="icon"></icon>
        <span @click="$emit('songQueueIconClicked')">
          <icon name="list" class="icon"></icon>
        </span>
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

@Component
export default class PlayerBar extends Vue {
  @State musicPlayer!: MusicPlayerState;

  @Action playNext!: () => void;
  @Action playPrevious!: () => void;
  @Action toggleCurrentTrack!: () => void;

  get songStatusIcon() {
    return this.musicPlayer.isPlaying ? 'pause-circle' : 'play-circle';
  }

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
