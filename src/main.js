import Vue from 'vue';

import store from '@/store';
import musicKit from '@/services/musicKit';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;
musicKit.init();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
