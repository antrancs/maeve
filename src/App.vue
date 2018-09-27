<template>
  <div id="app">
    <div class="app-wrapper">
      <app-header></app-header>
      <app-body></app-body>
    </div>
    <player-bar @song-queue-icon-clicked="toggleSongQueue"></player-bar>
    <song-queue ref="songQueue"></song-queue>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppBody from '@/components/AppBody.vue';
import AppHeader from '@/components/TheHeader.vue';
import PlayerBar from '@/components/ThePlayerBar.vue';
import SongQueue from '@/components/SongQueue.vue';

@Component({
  components: {
    AppHeader,
    AppBody,
    PlayerBar,
    SongQueue
  }
})
export default class App extends Vue {
  $refs!: {
    songQueue: SongQueue;
  };

  private toggleSongQueue(): void {
    this.$refs.songQueue.toggle();
  }
}
</script>

<style lang="scss">
@import '~normalize.css/normalize';
@import '@/styles/styles.scss';

#app {
  background: $bg-color;
  height: 100%;
}

.app-wrapper {
  color: $white-color;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}

.container {
  display: flex;
}

.media-item__info-title {
  font-weight: bold;
  overflow: hidden;
}

.context-menu-showing {
  overflow-y: hidden;
}
</style>
