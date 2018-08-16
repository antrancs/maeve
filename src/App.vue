<template>
  <div id="app">
    <app-header></app-header>
    <app-body></app-body>
  </div>
</template>

<script>
import Vue from 'vue';

import AppHeader from './components/TheHeader.vue';
import AppBody from './views/AppBody.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppBody
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
#app {
  color: #2c3e50;
}

.container {
  display: flex;
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
