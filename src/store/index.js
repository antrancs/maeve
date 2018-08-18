import Vue from 'vue';
import Vuex from 'vuex';

import musicKitPlayer from './musicKitPlayer.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    musicKitPlayer
  }
});
