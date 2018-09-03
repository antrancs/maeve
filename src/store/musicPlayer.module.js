import musicPlayerService from '@/services/musicPlayer.service';
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
  SET_IS_PLAYING,
  SET_PLAYBACK_PROGESS,
  SET_SONG_QUEUE
} from './mutations.type';

const initialState = {
  currentPlaying: null,
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

const playbackCallback = (context, progress) => {
  context.commit(SET_PLAYBACK_PROGESS, {
    playbackProgress: progress
  });
};

const actions = {
  [PLAY_NEXT](context) {
    musicPlayerService
      .playNext(evt => playbackCallback(context, evt.progress))
      .then(() => {
        context.commit(SET_CURRENTLY_PLAYING_SONG, {
          song: musicPlayerService.currentlyPlayingSong
        });
        context.commit(SET_IS_PLAYING, { isPlaying: true });
      });
  },

  [PLAY_PREVIOUS]({ dispatch, state }) {
    const prevSongIndex = state.currentPlayingIndex - 1;
    if (prevSongIndex < 0) {
      return;
    }
    const prevSong = state.songQueue[prevSongIndex];
    dispatch(PLAY_SONG, { songId: prevSong });
  },

  [PLAY_COLLECTION](context, { songId, collectionId, collectionType }) {
    musicPlayerService
      .playSongFromCollection(songId, collectionType, collectionId, evt =>
        playbackCallback(context, evt.progress))
      .then(() => {
        context.commit(SET_SONG_QUEUE, {
          songs: musicPlayerService.playbackQueue
        });
        context.commit(SET_CURRENTLY_PLAYING_SONG, {
          song: musicPlayerService.currentlyPlayingSong
        });
        context.commit(SET_IS_PLAYING, { isPlaying: true });
      });
  },

  [TOGGLE_MUSIC]({ dispatch }) {
    if (musicPlayerService.isPlaying) {
      dispatch(PAUSE_MUSIC);
    } else {
      dispatch(RESUME_MUSIC);
    }
  },

  [PAUSE_MUSIC]({ commit }) {
    musicPlayerService.pause();
    commit(SET_IS_PLAYING, { isPlaying: false });
  },

  [RESUME_MUSIC]({ commit }) {
    musicPlayerService
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
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
