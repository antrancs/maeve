import Vue from 'vue';
import Vuex from 'vuex';

import musicPlayer from './musicPlayer.module';
import songQueue from './songQueue.module';
import auth from './auth.module';
import router from './router.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    musicPlayer,
    auth,
    router,
    songQueue
  }
});
