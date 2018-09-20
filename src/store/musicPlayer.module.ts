import { GetterTree, MutationTree, ActionTree } from 'vuex';

import musicPlayerService from '@/services/musicPlayer.service';
import { getArtworkUrl } from '@/utils/utils';
import {
  PAUSE_CURRENT_TRACK,
  PLAY_COLLECTION_AT_INDEX,
  PLAY_NEXT,
  PLAY_PREVIOUS,
  RESUME_CURRENT_TRACK,
  TOGGLE_CURRENT_TRACK,
  APPEND_SONGS,
  ADD_TO_LIBRARY,
  PREPEND_SONGS
} from '@/store/actions.type';
import {
  SET_CURRENTLY_PLAYING_SONG,
  SET_IS_PLAYING,
  SET_PLAYBACK_PROGESS,
  SET_SONG_QUEUE
} from '@/store/mutations.type';
import {
  MusicPlayerState,
  PlayCollectionAtIndexPayload,
  AppendSongsPayload,
  AddToLibraryPayload
} from './types';

const initialState: MusicPlayerState = {
  currentPlaying: null,
  isPlaying: false,
  playbackProgress: 0,
  queuedSongs: []
};

const getters: GetterTree<MusicPlayerState, any> = {
  currentTrackArtwork(state) {
    return state.currentPlaying
      ? getArtworkUrl(state.currentPlaying.artwork.url, 500, 500)
      : '';
  }
};

const actions: ActionTree<MusicPlayerState, any> = {
  [PLAY_NEXT](context) {
    musicPlayerService.playNext().then(currentTrack => {
      context.commit(SET_CURRENTLY_PLAYING_SONG, currentTrack);
      context.commit(SET_IS_PLAYING, true);
    });
  },

  [PLAY_PREVIOUS](context) {
    musicPlayerService.playPrevious().then(currentTrack => {
      context.commit(SET_CURRENTLY_PLAYING_SONG, currentTrack);
      context.commit(SET_IS_PLAYING, true);
    });
  },

  [PLAY_COLLECTION_AT_INDEX](
    context,
    { playParams, index }: PlayCollectionAtIndexPayload
  ) {
    musicPlayerService
      .playCollectionAtIndex(playParams, index)
      .then(currentTrack => {
        context.commit(SET_CURRENTLY_PLAYING_SONG, currentTrack);
        context.commit(SET_IS_PLAYING, true);
        context.commit(SET_SONG_QUEUE, musicPlayerService.queuedSongs);
      });
  },

  [TOGGLE_CURRENT_TRACK]({ dispatch }) {
    if (musicPlayerService.isPlaying) {
      dispatch(PAUSE_CURRENT_TRACK);
    } else {
      dispatch(RESUME_CURRENT_TRACK);
    }
  },

  [PAUSE_CURRENT_TRACK]({ commit }) {
    musicPlayerService.pause();
    commit(SET_IS_PLAYING, false);
  },

  [RESUME_CURRENT_TRACK]({ commit }) {
    musicPlayerService
      .play()
      .then(() => {
        commit(SET_IS_PLAYING, true);
      })
      .catch(err => {
        console.log(err);
      });
  },

  [APPEND_SONGS]({ commit }, { items }: AppendSongsPayload) {
    musicPlayerService.appendItemsToQueue(items);
    commit(SET_SONG_QUEUE, musicPlayerService.queuedSongs);
  },

  [ADD_TO_LIBRARY]({ commit }, { itemIds, type }: AddToLibraryPayload) {
    return musicPlayerService.addToLibrary(itemIds, type);
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations: MutationTree<MusicPlayerState> = {
  [SET_CURRENTLY_PLAYING_SONG](state, track: MusicKit.MediaItem) {
    state.currentPlaying = track;
  },

  [SET_IS_PLAYING](state, isPlaying: boolean) {
    state.isPlaying = isPlaying;
  },

  [SET_PLAYBACK_PROGESS](state, playbackProgress: number) {
    state.playbackProgress = playbackProgress;
  },

  // [ADD_MULTI_SONGS_TO_QUEUE](state, { songs }) {
  //   if (!Array.isArray(songs)) {
  //     throw new Error('Must supply an array');
  //   }
  //   state.songQueue.push(...songs);
  // },

  [SET_SONG_QUEUE](state, songs) {
    state.queuedSongs = songs;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
