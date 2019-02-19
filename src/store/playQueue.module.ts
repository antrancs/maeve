import { GetterTree, ActionTree, MutationTree } from 'vuex';
import shuffle from 'lodash/shuffle';

import {
  PlayQueueState,
  AppendSongsPayload,
  RemoveFromMainSongsActionPayload,
  ChangeToIndexActionPayload
} from './types';
import {
  PlayQueueSong,
  PlayQueueNextSongToPlay,
  ShuffleMode
} from '@/@types/model/model';
import {
  TOGGLE_QUEUE_VISIBILITY,
  MOVE_NEXT_PLAY_QUEUE,
  PREPEND_SONGS_TO_QUEUE,
  APPEND_SONGS_TO_QUEUE,
  REMOVE_FROM_UP_NEXT,
  REMOVE_FROM_HISTORY,
  MOVE_BACK_PLAY_QUEUE,
  PLAY_NEXT,
  CHANGE_TO_INDEX_IN_UP_NEXT,
  CHANGE_TO_INDEX_IN_HISTORY,
  CHANGE_TO_INDEX_IN_YOUR_QUEUE,
  RESET_QUEUE
} from './actions.type';
import {
  SET_QUEUE_VISIBILITY,
  SET_MAIN_SONGS,
  SET_MAIN_SONGS_INDEX,
  SET_MAIN_SONGS_SOURCE,
  SET_NEXT_SONG_TO_PLAY,
  REMOVE_FROM_YOUR_QUEUE,
  REMOVE_FROM_MAIN_SONGS,
  SET_SHUFFLED_SONGS_INDEX,
  SET_YOUR_QUEUE,
  SET_SHUFFLED_SONGS,
  REMOVE_FROM_SHUFFLED_MAIN_SONGS,
  SET_YOUR_QUEUE_INDEX
} from './mutations.type';
import { RepeatMode } from '@/utils/constants';

const initialState: PlayQueueState = {
  visibility: false,
  mainSongs: [],
  mainSongsSource: '',
  mainSongsIndex: -1,
  nextSongToPlay: undefined,
  shuffledMainSongs: [],
  shuffleSongIndex: -1,
  queue: []
};

const getters: GetterTree<PlayQueueState, any> = {
  upNext(state, _, rootState) {
    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      return state.mainSongs.slice(state.mainSongsIndex + 1);
    }
    return state.shuffledMainSongs.slice(state.shuffleSongIndex + 1);
  },

  history(state, _, rootState) {
    const index =
      rootState.musicPlayer.shuffleMode === ShuffleMode.Off
        ? state.mainSongsIndex
        : state.shuffleSongIndex;

    const activeArray =
      rootState.musicPlayer.shuffleMode === ShuffleMode.Off
        ? state.mainSongs
        : state.shuffledMainSongs;
    /* When a song from 'Your Queue' is playing, the history will include the current song
    of the mainSongs
    */
    return rootState.musicPlayer.currentPlayingSource === 'Your Queue'
      ? activeArray.slice(0, index + 1)
      : activeArray.slice(0, index);
  }
};

const actions: ActionTree<PlayQueueState, any> = {
  [PREPEND_SONGS_TO_QUEUE]({ state }, { items }: AppendSongsPayload) {
    // unshift adds items to the front
    state.queue.unshift(...items);
  },

  [APPEND_SONGS_TO_QUEUE]({ state }, { items }: AppendSongsPayload) {
    state.queue.push(...items);
  },

  [TOGGLE_QUEUE_VISIBILITY]({ state, commit }) {
    const visibility = !state.visibility;
    commit(SET_QUEUE_VISIBILITY, visibility);
  },

  updateShuffledSongsIndex({ state, commit, rootState }) {
    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      const index = state.mainSongs.findIndex(
        song => song.qId === rootState.musicPlayer.currentPlaying.qId
      );

      if (index !== -1) {
        commit(SET_MAIN_SONGS_INDEX, index);
      }

      commit(SET_SHUFFLED_SONGS, []);
      return;
    }

    /* if a song from 'Your Queue' is playing, shuffle the entire 'mainSongs'.
      Otherwise, shuffle other songs in 'mainSongs' except the playing song
    */
    let shuffledSongs: PlayQueueSong[] = [];
    if (rootState.musicPlayer.currentPlayingSource === 'Your Queue') {
      // the next song to play will be the 1st item in the shuffledMainSongs arr
      commit(SET_SHUFFLED_SONGS_INDEX, -1);
      shuffledSongs = shuffle(state.mainSongs);
    } else {
      /* the next song to play will be the 2nd item in the shuffledMainSongs arr
      because the 1st item is being played
      */
      commit(SET_SHUFFLED_SONGS_INDEX, 0);

      const otherSongs = state.mainSongs.filter(
        (_, index) => index !== state.mainSongsIndex
      );
      shuffledSongs = [
        state.mainSongs[state.mainSongsIndex],
        ...shuffle(otherSongs)
      ];
    }

    commit(SET_SHUFFLED_SONGS, shuffledSongs);
  },

  [MOVE_NEXT_PLAY_QUEUE]({ state, commit, rootState }) {
    // When queue is empty, pick the next item in mainSongs/shuffledMainSongs to play
    if (state.queue.length === 0) {
      if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
        let nextIndex =
          rootState.musicPlayer.repeatMode === RepeatMode.One
            ? state.mainSongsIndex
            : state.mainSongsIndex + 1;

        // reset the index when we reach the end of the list
        if (nextIndex === state.mainSongs.length) {
          if (rootState.musicPlayer.repeatMode === RepeatMode.All) {
            nextIndex = 0;
          } else {
            commit(SET_NEXT_SONG_TO_PLAY, undefined);
            return;
          }
        }

        commit(SET_MAIN_SONGS_INDEX, nextIndex);
        commit(SET_NEXT_SONG_TO_PLAY, {
          song: state.mainSongs[state.mainSongsIndex],
          source: state.mainSongsSource
        });
      } else {
        let nextIndex =
          rootState.musicPlayer.repeatMode === RepeatMode.One
            ? state.shuffleSongIndex
            : state.shuffleSongIndex + 1;

        if (nextIndex === state.shuffledMainSongs.length) {
          if (rootState.musicPlayer.repeatMode === RepeatMode.All) {
            nextIndex = 0;
          } else {
            commit(SET_NEXT_SONG_TO_PLAY, undefined);
            return;
          }
        }

        commit(SET_SHUFFLED_SONGS_INDEX, nextIndex);
        commit(SET_NEXT_SONG_TO_PLAY, {
          song: state.shuffledMainSongs[state.shuffleSongIndex],
          source: state.mainSongsSource
        });
      }
    } else {
      const firstSongInQueue = state.queue.shift();
      commit(SET_NEXT_SONG_TO_PLAY, {
        song: firstSongInQueue,
        source: 'Your Queue'
      });
    }
  },

  [MOVE_BACK_PLAY_QUEUE]({ state, commit, rootState }) {
    if (state.mainSongsIndex === -1) {
      return;
    }

    let isPlayingYourQueue =
      rootState.musicPlayer.currentPlayingSource === 'Your Queue';
    // work on mainSongs list
    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      // if we're playing a song from 'Your Queue', the previous item is the current item in the main queue
      // otherwise, decrease the index
      const prevIndex = isPlayingYourQueue
        ? state.mainSongsIndex
        : state.mainSongsIndex - 1;
      commit(SET_MAIN_SONGS_INDEX, prevIndex);
      commit(SET_NEXT_SONG_TO_PLAY, {
        song: state.mainSongs[state.mainSongsIndex],
        source: state.mainSongsSource
      });
    } else {
      // work on shuffledMainSongs list
      // if we're playing a song from 'Your Queue', the previous item is the current item in the main queue
      // otherwise, decrease the index
      const prevIndex = isPlayingYourQueue
        ? state.shuffleSongIndex
        : state.shuffleSongIndex - 1;
      commit(SET_SHUFFLED_SONGS_INDEX, prevIndex);
      commit(SET_NEXT_SONG_TO_PLAY, {
        song: state.shuffledMainSongs[state.shuffleSongIndex],
        source: state.mainSongsSource
      });
    }
  },

  [REMOVE_FROM_UP_NEXT](
    { commit, state, rootState },
    { index, qId }: RemoveFromMainSongsActionPayload
  ) {
    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      commit(REMOVE_FROM_MAIN_SONGS, index + state.mainSongsIndex + 1);
    } else {
      commit(
        REMOVE_FROM_SHUFFLED_MAIN_SONGS,
        index + state.shuffleSongIndex + 1
      );
      // if we delete a song in the shuffled list, we have to delete that song in mainSongs as well
      const indexInMainSongs = state.mainSongs.findIndex(
        song => song.qId === qId
      );
      commit(REMOVE_FROM_MAIN_SONGS, indexInMainSongs);
    }
  },

  [REMOVE_FROM_HISTORY](
    { commit, rootState, state },
    { index, qId }: RemoveFromMainSongsActionPayload
  ) {
    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      commit(REMOVE_FROM_MAIN_SONGS, index);
    } else {
      commit(REMOVE_FROM_SHUFFLED_MAIN_SONGS, index);
      // if we delete a song in the shuffled list, we have to delete that song in mainSongs as well
      const indexInMainSongs = state.mainSongs.findIndex(
        song => song.qId === qId
      );
      commit(REMOVE_FROM_MAIN_SONGS, indexInMainSongs);
    }
  },

  [CHANGE_TO_INDEX_IN_UP_NEXT](
    { state, rootState, commit, dispatch },
    { index }: ChangeToIndexActionPayload
  ) {
    // clear 'Your Queue' as Up Next is after 'Your Queue'
    commit(SET_YOUR_QUEUE, []);

    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      commit(SET_MAIN_SONGS_INDEX, index + state.mainSongsIndex);
    } else {
      commit(SET_SHUFFLED_SONGS_INDEX, index + state.shuffleSongIndex);
    }

    dispatch(PLAY_NEXT);
  },

  [CHANGE_TO_INDEX_IN_HISTORY](
    { dispatch, rootState, commit },
    { index }: ChangeToIndexActionPayload
  ) {
    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      // subtract 1 from the index so when we dispatch playNext, we're at the right index
      commit(SET_MAIN_SONGS_INDEX, index - 1);
    } else {
      commit(SET_SHUFFLED_SONGS_INDEX, index - 1);
    }

    dispatch(PLAY_NEXT);
  },

  [CHANGE_TO_INDEX_IN_YOUR_QUEUE](
    { dispatch, commit },
    { index }: ChangeToIndexActionPayload
  ) {
    commit(SET_YOUR_QUEUE_INDEX, index);
    dispatch(PLAY_NEXT);
  },

  [RESET_QUEUE]({ commit }) {
    commit(SET_MAIN_SONGS, []);
    commit(SET_MAIN_SONGS_INDEX, -1);
    commit(SET_SHUFFLED_SONGS, []);
    commit(SET_SHUFFLED_SONGS_INDEX, -1);
    commit(SET_YOUR_QUEUE, []);
    commit(SET_NEXT_SONG_TO_PLAY, undefined);
  }
};

const mutations: MutationTree<PlayQueueState> = {
  [SET_QUEUE_VISIBILITY](state, visibility: boolean) {
    state.visibility = visibility;
  },

  [SET_MAIN_SONGS](state, songs: PlayQueueSong[]) {
    state.mainSongs = songs;
    state.mainSongsIndex = -1;
  },

  [SET_MAIN_SONGS_INDEX](state, newValue: number) {
    state.mainSongsIndex = newValue;
  },

  [SET_SHUFFLED_SONGS](state, items: PlayQueueSong[]) {
    state.shuffledMainSongs = items;
  },

  [SET_SHUFFLED_SONGS_INDEX](state, newValue: number) {
    state.shuffleSongIndex = newValue;
  },

  [SET_MAIN_SONGS_SOURCE](state, sourceName: string) {
    state.mainSongsSource = sourceName;
  },

  [SET_NEXT_SONG_TO_PLAY](state, item: PlayQueueNextSongToPlay | undefined) {
    state.nextSongToPlay = item;
  },

  [REMOVE_FROM_YOUR_QUEUE](state, index) {
    state.queue.splice(index, 1);
  },

  [REMOVE_FROM_MAIN_SONGS](state, index) {
    if (index <= state.mainSongsIndex) {
      state.mainSongsIndex -= 1;
    }

    state.mainSongs.splice(index, 1);
  },

  [REMOVE_FROM_SHUFFLED_MAIN_SONGS](state, index) {
    if (index <= state.shuffleSongIndex) {
      state.shuffleSongIndex -= 1;
    }

    state.shuffledMainSongs.splice(index, 1);
  },

  [SET_YOUR_QUEUE](state, items: PlayQueueSong[]) {
    state.queue = items;
  },

  // 'move' to the specified index of 'Your Queue'
  [SET_YOUR_QUEUE_INDEX](state, index: number) {
    state.queue = state.queue.slice(index);
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
