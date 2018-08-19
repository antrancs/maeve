import { PLAY_SONG, TOGGLE_MUSIC } from './actions.type';
import {
  SET_CURRENTLY_PLAYING_SONG,
  SET_IS_PLAYING,
  SET_PLAYBACK_PROGESS
} from './mutations.type';

const initialState = {
  currentPlaying: null,
  isPlaying: false,
  playbackProgress: 0
};

const getters = {};

const actions = {
  [PLAY_SONG](context, songId) {
    // Will move MusicKit to a common service
    const music = window.MusicKit.getInstance();
    music.addEventListener('playbackProgressDidChange', evt => {
      console.log(evt.progress);
      context.commit(SET_PLAYBACK_PROGESS, { playbackProgress: evt.progress });
    });
    music
      .setQueue({
        song: songId
      })
      .then(queue => {
        context.commit(SET_CURRENTLY_PLAYING_SONG, { song: queue.items[0] });
        context.commit(SET_IS_PLAYING, { isPlaying: true });
        music.play();
      });
  },
  [TOGGLE_MUSIC]({ commit, state }) {
    const music = window.MusicKit.getInstance();

    if (state.isPlaying) {
      music.pause();
    } else {
      music.play();
    }
    commit(SET_IS_PLAYING, { isPlaying: !state.isPlaying });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_CURRENTLY_PLAYING_SONG](state, payload) {
    state.currentPlaying = payload.song;
  },
  [SET_IS_PLAYING](state, payload) {
    state.isPlaying = payload.isPlaying;
  },
  [SET_PLAYBACK_PROGESS](state, { playbackProgress }) {
    if (Number.isNaN(playbackProgress)) {
      throw new Error(`playbackProgress is not a number: ${playbackProgress}`);
    }
    state.playbackProgress = playbackProgress;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
