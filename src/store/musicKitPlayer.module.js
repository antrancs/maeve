import { PLAY_SONG } from './actions.type';
import { SET_CURRENTLY_PLAYING_SONG } from './mutations.type';

const initialState = {
  currentPlaying: {}
};

const getters = {
  currentPlaying(state) {
    return state.currentPlaying;
  }
};

const actions = {
  [PLAY_SONG](context, songId) {
    // Will move MusicKit to a common service
    const music = window.MusicKit.getInstance();
    music
      .setQueue({
        song: songId
      })
      .then(queue => {
        context.commit(SET_CURRENTLY_PLAYING_SONG, { song: queue.items[0] });
        music.play();
      });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_CURRENTLY_PLAYING_SONG](state, payload) {
    state.currentPlaying = payload.song;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
