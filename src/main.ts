import Vue from 'vue';

import store from '@/store';
import router from '@/router';
import '@/plugins';
import musicKit from '@/services/musicKit';
import { connectMusicKitToStore } from '@/setup/musickit';
import '@/setup/icons';
import App from './App.vue';

Vue.config.productionTip = false;
musicKit.init();

connectMusicKitToStore(musicKit.getInstance(), store);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
