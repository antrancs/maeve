<template>
  <div id="app">
    <app-header></app-header>
    <app-body></app-body>
    <player-bar></player-bar>
  </div>
</template>

<script>
import Vue from 'vue';

import AppHeader from './components/TheHeader.vue';
import AppBody from './views/AppBody.vue';
import PlayerBar from './components/PlayerBar.vue';

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

.container {
  display: flex;
}

.media-info-title {
  font-weight: bold;
  overflow: hidden;
}

#nav {
  width: 200px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
