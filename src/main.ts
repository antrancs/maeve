import Vue from 'vue';
import Component from 'vue-class-component';

import './registerServiceWorker';
import setupMusicKit from '@/utils/musicKit';
setupMusicKit();

import store from '@/store';
import router from '@/router';
import '@/plugins';
import '@/filters';
import App from './App.vue';

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
]);

import AppButton from '@/components/AppButton.vue';
import ContentSection from '@/components/ContentSection.vue';

Vue.config.productionTip = false;
// Vue.config.performance = true;

Vue.component('app-button', AppButton);
Vue.component('content-section', ContentSection);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
