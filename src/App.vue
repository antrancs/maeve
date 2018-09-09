<template>
  <div id="app">
    <div class="app-wrapper">
      <app-header></app-header>
      <app-body></app-body>
    </div>
    <player-bar></player-bar>
  </div>
</template>

<script>
import AppHeader from './components/TheHeader.vue';
import AppBody from './views/AppBody.vue';
import PlayerBar from './components/ThePlayerBar.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppBody,
    PlayerBar
  }
};
</script>

<style lang="scss">
@import '~normalize.css/normalize';
@import '@/styles/styles.scss';

#app {
  background: #121622;
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
</style>
