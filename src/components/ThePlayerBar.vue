<template>
  <div v-if="currentPlaying" class="player-bar-wrapper">
    <div class="player-bar">
      <div class="player-bar__left">
        <div class="player-bar__artist-name ">{{currentPlaying.attributes.name}}</div>
        <div class="player-bar__song-name">{{currentPlaying.attributes.artistName}}</div>
      </div>

      <div class="player-bar__center ">
        <div class="player-bar__controls">
          <icon name="redo" class="icon"></icon>
          <span @click="handleBackwardClicked">
            <icon name="backward" class="icon"></icon>
          </span>

          <span @click="toggleCurrentPlaying">
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
            max="100" :value="playbackProgress * 100"
          >
            {{playbackProgress * 100}}
          </progress>
        </div>
      </div>

      <div class="player-bar__right">
        <icon name="volume-up" class="icon"></icon>
        <icon name="list" class="icon"></icon>
      </div>
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons/backward';
import 'vue-awesome/icons/forward';
import 'vue-awesome/icons/list';
import 'vue-awesome/icons/pause-circle';
import 'vue-awesome/icons/play-circle';
import 'vue-awesome/icons/random';
import 'vue-awesome/icons/redo';
import 'vue-awesome/icons/volume-up';
import Icon from 'vue-awesome/components/Icon.vue';
import { mapState, mapActions, mapMutations } from 'vuex';

import {
  PAUSE_MUSIC,
  PLAY_NEXT,
  PLAY_PREVIOUS,
  TOGGLE_MUSIC
} from '@/store/actions.type';
import { SET_IS_PLAYING } from '@/store/mutations.type';

export default {
  name: 'PlayerBar',

  components: {
    Icon
  },

  computed: {
    songStatusIcon() {
      // console.log('isPlayingMusicKit', this.isPlayingMusicKit);
      return this.isPlaying ? 'pause-circle' : 'play-circle';
    },
    ...mapState({
      isPlaying: state => state.musicPlayer.isPlaying,
      currentPlaying: state => state.musicPlayer.currentPlaying,
      playbackProgress: state => state.musicPlayer.playbackProgress
    })
  },

  watch: {
    playbackProgress() {
      if (this.playbackProgress === 1) {
        this.setIsPlaying(false);
        this.playNext();
      }
    }
  },

  methods: {
    handleForwardClicked() {
      this.pauseMusic();
      this.playNext();
    },

    handleBackwardClicked() {
      this.pauseMusic();
      this.playPrevious();
    },

    ...mapActions({
      toggleCurrentPlaying: TOGGLE_MUSIC,
      pauseMusic: PAUSE_MUSIC,
      playNext: PLAY_NEXT,
      playPrevious: PLAY_PREVIOUS
    }),

    ...mapMutations({
      setIsPlaying: SET_IS_PLAYING
    })
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/components/_player-bar.scss';
</style>
