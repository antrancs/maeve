import { getArtworkUrl } from '@/utils/utils';
import {
  PAUSE_MUSIC,
  PLAY_COLLECTION,
  PLAY_NEXT,
  PLAY_PREVIOUS,
  PLAY_SONG,
  RESUME_MUSIC,
  TOGGLE_MUSIC
} from './actions.type';
import {
  ADD_MULTI_SONGS_TO_QUEUE,
  SET_CURRENTLY_PLAYING_SONG,
  SET_CURRENT_PLAYING_INDEX,
  SET_IS_PLAYING,
  SET_PLAYBACK_PROGESS,
  SET_SONG_QUEUE
} from './mutations.type';

const initialState = {
  currentPlaying: null,
  currentPlayingIndex: 0,
  isPlaying: false,
  playbackProgress: 0,
  songQueue: []
};

const getters = {
  currentPlayingArtwork(state) {
    return state.currentPlaying
      ? getArtworkUrl(state.currentPlaying.attributes.artwork.url, 500, 500)
      : '';
  }
};

const actions = {
  [PLAY_SONG](context, { songId }) {
    // Will move MusicKit to a common service
    const music = window.MusicKit.getInstance();
    music.removeEventListener('playbackProgressDidChange');
    music.addEventListener('playbackProgressDidChange', evt => {
      // console.log(evt.progress);
      context.commit(SET_PLAYBACK_PROGESS, { playbackProgress: evt.progress });
    });

    music
      .setQueue({
        song: songId
      })
      .then(queue => {
        if (queue.items.length === 0) {
          return Promise.resolve();
        }
        context.commit(SET_CURRENTLY_PLAYING_SONG, { song: queue.items[0] });
        return music.play();
      })
      .then(() => {
        context.commit(SET_IS_PLAYING, { isPlaying: true });
      });
  },

  [PLAY_NEXT]({ commit, dispatch, state }) {
    const nextSongIndex = state.currentPlayingIndex + 1;

    if (nextSongIndex >= state.songQueue.length - 1) {
      return;
    }

    const nextSong = state.songQueue[nextSongIndex];
    commit(SET_CURRENT_PLAYING_INDEX, { index: nextSongIndex });
    dispatch(PLAY_SONG, { songId: nextSong });
  },

  [PLAY_PREVIOUS]({ commit, dispatch, state }) {
    const prevSongIndex = state.currentPlayingIndex - 1;
    if (prevSongIndex < 0) {
      return;
    }
    const prevSong = state.songQueue[prevSongIndex];
    commit(SET_CURRENT_PLAYING_INDEX, { index: prevSongIndex });
    dispatch(PLAY_SONG, { songId: prevSong });
  },

  [PLAY_COLLECTION](context, { collectionId, collectionType, atIndex }) {
    const music = window.MusicKit.getInstance();

    music
      .setQueue({
        [collectionType]: collectionId
      })
      .then(queue => {
        const songIds = queue.items.map(({ id }) => id);
        context.commit(SET_SONG_QUEUE, { songs: songIds });
        context.commit(SET_CURRENT_PLAYING_INDEX, { index: atIndex });
        context.dispatch(PLAY_SONG, { songId: songIds[atIndex] });
      })
      .catch(err => {
        console.log(err);
      });
  },

  [TOGGLE_MUSIC]({ dispatch, state }) {
    if (state.isPlaying) {
      dispatch(PAUSE_MUSIC);
    } else {
      dispatch(RESUME_MUSIC);
    }
  },

  [PAUSE_MUSIC]({ commit }) {
    const music = window.MusicKit.getInstance();
    music.pause();
    commit(SET_IS_PLAYING, { isPlaying: false });
  },

  [RESUME_MUSIC]({ commit }) {
    const music = window.MusicKit.getInstance();
    music
      .play()
      .then(() => {
        commit(SET_IS_PLAYING, { isPlaying: true });
      })
      .catch(err => {
        console.log(err);
      });
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
  },

  [ADD_MULTI_SONGS_TO_QUEUE](state, { songs }) {
    if (!Array.isArray(songs)) {
      throw new Error('Must supply an array', songs);
    }
    state.songQueue.push(...songs);
  },

  [SET_SONG_QUEUE](state, { songs }) {
    state.songQueue = songs;
  },

  [SET_CURRENT_PLAYING_INDEX](state, { index }) {
    state.currentPlayingIndex = index;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
