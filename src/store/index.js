import Vue from 'vue';
import Vuex from 'vuex';

import musicPlayer from './musicPlayer.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    musicPlayer
  }
});
