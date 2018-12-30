import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import musicKit from '@/services/musicKit';
musicKit.init();

import store from '@/store';
import router from '@/router';
import '@/plugins';
import { connectMusicKitToStore } from '@/setup/musickit';
import '@/filters';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  theme: {
    primary: '#062743',
    secondary: '#113a5d',
    accent: '#da0f47',
    error: '#FF9800',
    primaryText: '#ffffff',
    secondaryText: '#BDBDBD'
  },
  options: {
    customProperties: true
  }
});

connectMusicKitToStore(musicKit.getInstance(), store);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
