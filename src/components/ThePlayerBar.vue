<template>
  <div v-if="currentPlaying" class="player-bar-wrapper">
    <div class="player-bar">
      <div class="player-bar--left">
        <div>A song by Cardi B</div>
        <div>Cardi B</div>
      </div>

      <div class="player-bar--center">
        <div class="player-bar--controls">
          <icon name="redo" class="player-bar--icon"></icon>
          <span @click="handleBackwardClicked">
            <icon name="backward" class="player-bar--icon"></icon>
          </span>

          <span @click="toggleCurrentPlaying">
            <icon
              :name="songStatusIcon"
              class="player-bar--icon player-bar--icon__large"
            >
            </icon>
          </span>

          <span @click="handleForwardClicked">
            <icon name="forward" class="player-bar--icon">
            </icon>
          </span>

          <icon name="random" class="player-bar--icon"></icon>
        </div>

        <div>
          <progress class="player-bar--progress-bar"
            max="100" :value="playbackProgress * 100"
          >
            {{playbackProgress * 100}}
          </progress>
        </div>
      </div>

      <div class="player-bar--right">
        <icon name="volume-up" class="player-bar--icon"></icon>
        <icon name="list" class="player-bar--icon"></icon>
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
.player-bar-wrapper {
  background-color: #282828;
  bottom: 0;
  height: 72px;
  position: fixed;
  width: 100%;
}

.player-bar {
  display: flex;
  height: 100%;
  flex: 1;
}

.player-bar--left {
  flex: 0 0 200px;
}

.player-bar--right {
  flex: 0 0 200px;
}

.player-bar--center {
  display: flex;
  justify-content: center;
  flex: 1;
  flex-direction: column;
}

.player-bar--controls {
  align-items: center;
  justify-content: center;
  display: flex;
}

.player-bar--progress-bar {
  width: 100%;
}

.player-bar--icon {
  color: white;
  cursor: pointer;
  margin-left: 16px;
  max-width: 100%;
  max-height: 100%;
}

.player-bar--icon__large {
  height: 25px;
  width: auto;
}
</style>
