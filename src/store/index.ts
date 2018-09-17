import Vue from 'vue';
import Vuex from 'vuex';

import musicPlayer from './musicPlayer.module';
import auth from './auth.module';
import router from './router.module';
import contextMenu from './contextMenu.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    musicPlayer,
    auth,
    router,
    contextMenu
  }
});
