<template>
  <div id="app" class="app-wrapper">
    <app-header></app-header>
    <app-body></app-body>
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
* {
  box-sizing: border-box;
}
html {
  height: 100%;
}

body {
  height: 100%;
  overflow: hidden;
}

.app-wrapper {
  height: 100%;
}

.container {
  display: flex;
}

.media-info-title {
  font-weight: bold;
  overflow: hidden;
}
</style>
