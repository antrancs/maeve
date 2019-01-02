import Vue from 'vue';
import Vuex from 'vuex';

import musicPlayer from './musicPlayer.module';
import playQueue from './playQueue.module';
import auth from './auth.module';
import router from './router.module';
import collection from './collection.module';
import snackbar from './snackbar.module';
import library from './library.module';
import settings from './settings.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    musicPlayer,
    auth,
    router,
    playQueue,
    collection,
    snackbar,
    library,
    settings
  }
});
