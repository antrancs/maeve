<template>
  <div class="player-bar-wrapper">
    <div class="player-bar">
      <div class="player-bar--left">
        <div>A song by Cardi B</div>
        <div>Cardi B</div>
      </div>

      <div class="player-bar--center">
        <div class="player-bar--controls">
          <icon name="redo" class="player-bar--icon"></icon>
          <icon name="backward" class="player-bar--icon"></icon>
          <icon name="play" class="player-bar--icon player-bar--icon__large"></icon>
          <icon name="forward" class="player-bar--icon"></icon>
          <icon name="random" class="player-bar--icon"></icon>
        </div>

        <div class="player-bar--progress-bar">
          My progress bar
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
import 'vue-awesome/icons/play';
import 'vue-awesome/icons/random';
import 'vue-awesome/icons/redo';
import 'vue-awesome/icons/volume-up';
import Icon from 'vue-awesome/components/Icon.vue';

export default {
  name: 'PlayerBar',

  components: {
    Icon
  }
};
</script>

<style lang="scss" scoped>
.player-bar-wrapper {
  bottom: 0;
  height: 72px;
  position: fixed;
  width: 100%;
}

.player-bar {
  display: flex;
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
  flex: 1;
  flex-direction: column;
}

.player-bar--controls {
  align-items: center;
  justify-content: center;
  display: flex;
}

.player-bar--progress-bar {
  background-color: blue;
}

.player-bar--icon {
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
