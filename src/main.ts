import Vue from 'vue';
import 'vuetify/dist/vuetify.min.css';

import musicKit from '@/services/musicKit';
musicKit.init();

import store from '@/store';
import router from '@/router';
import '@/plugins';
import { connectMusicKitToStore } from '@/setup/musickit';
import '@/filters';
import App from './App.vue';

import Component from 'vue-class-component';

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
]);

import Chrome from 'vue-color/src/components/Chrome.vue';
import AppButton from '@/components/AppButton.vue';

Vue.config.productionTip = false;

Vue.component('chrome-picker', Chrome);
Vue.component('app-button', AppButton);

connectMusicKitToStore(musicKit.getInstance(), store);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
