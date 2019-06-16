import Vue from 'vue';
import Vuex from 'vuex';

import musicPlayer from './musicPlayer.module';
import playQueue from './playQueue.module';
import auth from './auth.module';
import router from './router.module';
import snackbar from './snackbar.module';
import library from './library.module';
import catalog from './catalog.module';
import settings from './settings.module';
import layout from './layout.module';
import lastfm from './lastfm.module';
import newPlaylistDialog from './newPlaylistDialog.module';
import themeEditorDialog from './themeEditorDialog.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    musicPlayer,
    auth,
    router,
    playQueue,
    snackbar,
    library,
    catalog,
    settings,
    layout,
    lastfm,
    newPlaylistDialog,
    themeEditorDialog
  }
});
