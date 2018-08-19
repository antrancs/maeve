<template>
  <div id="app" class="app-wrapper">
    <app-header></app-header>
    <app-body></app-body>
    <player-bar></player-bar>
  </div>
</template>

<script>
import Vue from 'vue';

import AppHeader from './components/TheHeader.vue';
import AppBody from './views/AppBody.vue';
import PlayerBar from './components/ThePlayerBar.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppBody,
    PlayerBar
  },
  created() {
    document.addEventListener('musickitloaded', () => {
      console.log('musickitloaded');
      window.MusicKit.configure({
        developerToken: process.env.VUE_APP_DEVELOPER_TOKEN,
        app: {
          name: 'Maeve',
          build: '0.1'
        }
      });
      const music = window.MusicKit.getInstance();

      // we just add music to the prototype for now. We'll move it to the store later
      Vue.prototype.$music = music;
    });
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
