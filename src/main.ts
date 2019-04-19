import Vue from 'vue';
import 'vuetify/dist/vuetify.min.css';
import './registerServiceWorker';

import musicKit from '@/services/musicKit';
musicKit.init();

import store from '@/store';
import router from '@/router';
import '@/plugins';
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
import SectionHeader from '@/components/SectionHeader.vue';

Vue.config.productionTip = false;
// Vue.config.performance = true;

Vue.component('chrome-picker', Chrome);
Vue.component('app-button', AppButton);
Vue.component('section-header', SectionHeader);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
