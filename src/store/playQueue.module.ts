import { GetterTree, ActionTree, MutationTree } from 'vuex';
import shuffle from 'lodash/shuffle';

import {
  PlayQueueState,
  AppendSongsPayload,
  RemoveFromMainSongsActionPayload,
  ChangeToIndexActionPayload,
  MoveNextPlayQueuePayload
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
  RESET_QUEUE,
  TOGGLE_SHUFFLE,
  SHUFFLE_MAIN_SONGS,
  SHUFFLE_YOUR_QUEUE,
  PLAY_CURRENT
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
  SET_YOUR_QUEUE_INDEX,
  MOVE_NEXT_IN_QUEUE
} from './mutations.type';
import { RepeatMode } from '@/utils/constants';

const initialState: PlayQueueState = {
  visibility: false,
  mainSongs: [],
  mainSongsSource: '',
  mainSongsIndex: 0,
  nextSongToPlay: undefined,
  shuffledMainSongs: [],
  shuffleSongIndex: 0,
  queue: []
};

const getters: GetterTree<PlayQueueState, any> = {
  upNext(state, getters, _, rootGetters) {
    const { currentSongs, currentSongIndex } = getters;

    return rootGetters.isYourQueuePlaying
      ? currentSongs.slice(currentSongIndex)
      : currentSongs.slice(currentSongIndex + 1);
  },

  history(state, getters, rootState) {
    const { currentSongs, currentSongIndex } = getters;
    return currentSongs.slice(0, currentSongIndex);
  },

  yourQueue(state, _, __, rootGetters) {
    return rootGetters.isYourQueuePlaying ? state.queue.slice(1) : state.queue;
  },

  canGoBack(state, _, rootState) {
    return (
      (rootState.musicPlayer.shuffleMode === ShuffleMode.Off &&
        state.mainSongsIndex > 0) ||
      (rootState.musicPlayer.shuffleMode === ShuffleMode.On &&
        state.shuffleSongIndex > 0)
    );
  },

  canGoNext(state, _, rootState) {
    if (state.queue.length > 0) {
      return true;
    }
    // if we're at the end of the list & RepeatMode is not Off, we can move next
    const canMoveNextWhenNotShuffle =
      rootState.musicPlayer.repeatMode !== RepeatMode.Off ||
      (rootState.musicPlayer.shuffleMode === ShuffleMode.Off &&
        state.mainSongsIndex < state.mainSongs.length - 1);

    const canMoveNextWhenShuffle =
      rootState.musicPlayer.repeatMode !== RepeatMode.Off ||
      (rootState.musicPlayer.shuffleMode === ShuffleMode.On &&
        state.shuffleSongIndex < state.shuffledMainSongs.length - 1);

    return canMoveNextWhenNotShuffle || canMoveNextWhenShuffle;
  },

  currentSongs(state, _, rootState) {
    return rootState.musicPlayer.shuffleMode === ShuffleMode.Off
      ? state.mainSongs
      : state.shuffledMainSongs;
  },

  currentSongIndex(state, _, rootState) {
    return rootState.musicPlayer.shuffleMode === ShuffleMode.Off
      ? state.mainSongsIndex
      : state.shuffleSongIndex;
  },

  nextSong(state, getters, rootState, rootGetters) {
    const { currentSongs, currentSongIndex } = getters;

    // When queue is empty, pick the next item in mainSongs/shuffledMainSongs to play
    if (state.queue.length === 0) {
      return currentSongs[currentSongIndex + 1];
    }

    if (!rootGetters.isYourQueuePlaying) {
      return state.queue[0];
    }

    return state.queue.length === 1
      ? currentSongs[currentSongIndex]
      : state.queue[1];
  },

  previousSong(_, getters, __, rootGetters) {
    const { currentSongs, currentSongIndex } = getters;

    // if we're playing a song from 'Your Queue', the previous item is the current item in the main queue
    // otherwise, decrease the index
    return rootGetters.isYourQueuePlaying
      ? currentSongs[currentSongIndex]
      : currentSongs[currentSongIndex - 1];
  },

  currentSong(state, getters, rootState, rootGetters) {
    const { currentSongs, currentSongIndex } = getters;

    if (rootGetters.isYourQueuePlaying) {
      return state.queue[0];
    }
    return currentSongs[currentSongIndex];
  }
};

const actions: ActionTree<PlayQueueState, any> = {
  [PREPEND_SONGS_TO_QUEUE](
    { state, rootGetters },
    { items }: AppendSongsPayload
  ) {
    if (rootGetters.isYourQueuePlaying) {
      // if we're playing a queue, add new items starting at index 1 (because the current
      // playing item is already at index 0)
      state.queue.splice(1, 0, ...items);
    } else {
      // unshift adds items to the front
      state.queue.unshift(...items);
    }
  },

  [APPEND_SONGS_TO_QUEUE]({ state }, { items }: AppendSongsPayload) {
    state.queue.push(...items);
  },

  [TOGGLE_QUEUE_VISIBILITY]({ state, commit }) {
    const visibility = !state.visibility;
    commit(SET_QUEUE_VISIBILITY, visibility);
  },

  [SHUFFLE_MAIN_SONGS]({ state, commit }) {
    // the next song to play will be the 1st item in the shuffledMainSongs arr
    // commit(SET_SHUFFLED_SONGS_INDEX, 0);
    const shuffledSongs = shuffle(state.mainSongs);
    commit(SET_SHUFFLED_SONGS, shuffledSongs);
  },

  [TOGGLE_SHUFFLE]({ state, commit, rootState, dispatch, rootGetters }) {
    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      if (rootGetters.isYourQueuePlaying) {
        // reset the index so that the play queue comes before mainSongs
        commit(SET_MAIN_SONGS_INDEX, 0);
      } else {
        const index = state.mainSongs.findIndex(
          song => song.qId === rootState.musicPlayer.currentPlaying.qId
        );

        if (index !== -1) {
          commit(SET_MAIN_SONGS_INDEX, index);
        }
      }
      commit(SET_SHUFFLED_SONGS, []);
      return;
    }

    /* if a song from 'Your Queue' is playing, shuffle the entire 'mainSongs'.
      Otherwise, shuffle other songs in 'mainSongs' except the playing song
    */
    if (rootGetters.isYourQueuePlaying) {
      dispatch(SHUFFLE_MAIN_SONGS);
    } else {
      /* the next song to play will be the 2nd item in the shuffledMainSongs arr
      because the 1st item is being played
      */
      const otherSongs = state.mainSongs.filter(
        (_, index) => index !== state.mainSongsIndex
      );
      const shuffledSongs = [
        state.mainSongs[state.mainSongsIndex],
        ...shuffle(otherSongs)
      ];
      commit(SET_SHUFFLED_SONGS, shuffledSongs);
    }
    commit(SET_SHUFFLED_SONGS_INDEX, 0);
  },

  [MOVE_NEXT_PLAY_QUEUE](
    { state, commit, rootState, getters, rootGetters },
    { forceSkip }: MoveNextPlayQueuePayload
  ) {
    // When queue is empty, pick the next item in mainSongs/shuffledMainSongs to play
    const { currentSong, currentSongIndex } = getters;
    let { nextSong } = getters;

    if (rootState.musicPlayer.repeatMode === RepeatMode.One && !forceSkip) {
      // if we're repeating a song, the source stays the same
      const source = rootState.musicPlayer.currentPlayingSource;
      commit(SET_NEXT_SONG_TO_PLAY, {
        song: currentSong,
        source
      });
      return;
    }

    if (rootGetters.isYourQueuePlaying) {
      commit(MOVE_NEXT_IN_QUEUE);
    } else {
      let nextIndex = currentSongIndex + 1;

      if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
        if (nextIndex === state.mainSongs.length) {
          // end of list
          if (
            rootState.musicPlayer.repeatMode === RepeatMode.Off &&
            state.queue.length === 0
          ) {
            commit(SET_NEXT_SONG_TO_PLAY, null);
            return;
          }
          nextIndex = 0;

          if (state.queue.length === 0) {
            nextSong = state.mainSongs[0];
          }
        }
        commit(SET_MAIN_SONGS_INDEX, nextIndex);
      } else {
        if (nextIndex === state.shuffledMainSongs.length) {
          if (rootState.musicPlayer.repeatMode === RepeatMode.Off) {
            commit(SET_NEXT_SONG_TO_PLAY, null);
            return;
          }
          nextIndex = 0;

          if (state.queue.length === 0) {
            nextSong = state.shuffledMainSongs[0];
          }
        }
        commit(SET_SHUFFLED_SONGS_INDEX, nextIndex);
      }
    }

    const source =
      state.queue.length === 0 ? state.mainSongsSource : 'Your Queue';

    if (nextSong) {
      commit(SET_NEXT_SONG_TO_PLAY, {
        song: nextSong,
        source
      });
    }
    if (
      state.queue.length === 0 &&
      state.mainSongs.length === 0 &&
      state.shuffledMainSongs.length === 0
    ) {
      commit(SET_QUEUE_VISIBILITY, false);
      commit(SET_NEXT_SONG_TO_PLAY, {
        song: null,
        source: ''
      });
    }
  },

  [MOVE_BACK_PLAY_QUEUE]({ state, commit, rootState, rootGetters, getters }) {
    if (state.mainSongsIndex === 0) {
      return;
    }

    // work on mainSongs list
    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      // if we're playing a song from 'Your Queue', the previous item is the current item in the main queue
      // otherwise, decrease the index
      const prevIndex = rootGetters.isYourQueuePlaying
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
      const prevIndex = rootGetters.isPlayingYourQueue
        ? state.shuffleSongIndex
        : state.shuffleSongIndex - 1;
      commit(SET_SHUFFLED_SONGS_INDEX, prevIndex);
      commit(SET_NEXT_SONG_TO_PLAY, {
        song: state.shuffledMainSongs[state.shuffleSongIndex],
        source: state.mainSongsSource
      });
    }

    const { currentSongs, currentSongIndex } = getters;

    commit(SET_NEXT_SONG_TO_PLAY, {
      song: currentSongs[currentSongIndex],
      source: state.mainSongsSource
    });
  },

  [REMOVE_FROM_UP_NEXT](
    { commit, state, rootState },
    { index, qId }: RemoveFromMainSongsActionPayload
  ) {
    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      commit(REMOVE_FROM_MAIN_SONGS, index + state.mainSongsIndex);
    } else {
      commit(REMOVE_FROM_SHUFFLED_MAIN_SONGS, index + state.shuffleSongIndex);
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
    { state, rootState, commit, dispatch, getters, rootGetters },
    { index }: ChangeToIndexActionPayload
  ) {
    // clear 'Your Queue' as Up Next is after 'Your Queue'
    commit(SET_YOUR_QUEUE, []);

    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      const nextIndex = index + state.mainSongsIndex;
      commit(
        SET_MAIN_SONGS_INDEX,
        rootGetters.isYourQueuePlaying ? nextIndex : nextIndex + 1
      );
    } else {
      const nextIndex = index + state.shuffleSongIndex;
      commit(
        SET_SHUFFLED_SONGS_INDEX,
        rootGetters.isYourQueuePlaying ? nextIndex : nextIndex + 1
      );
    }

    const { currentSongs, currentSongIndex } = getters;

    commit(SET_NEXT_SONG_TO_PLAY, {
      song: currentSongs[currentSongIndex],
      source: state.mainSongsSource
    });

    dispatch(PLAY_CURRENT);
  },

  [CHANGE_TO_INDEX_IN_HISTORY](
    { dispatch, rootState, commit, getters, state },
    { index }: ChangeToIndexActionPayload
  ) {
    if (rootState.musicPlayer.shuffleMode === ShuffleMode.Off) {
      commit(SET_MAIN_SONGS_INDEX, index);
    } else {
      commit(SET_SHUFFLED_SONGS_INDEX, index);
    }

    const { currentSongs, currentSongIndex } = getters;

    commit(SET_NEXT_SONG_TO_PLAY, {
      song: currentSongs[currentSongIndex],
      source: state.mainSongsSource
    });

    dispatch(PLAY_CURRENT);
  },

  [CHANGE_TO_INDEX_IN_YOUR_QUEUE](
    { dispatch, commit, state },
    { index }: ChangeToIndexActionPayload
  ) {
    commit(SET_YOUR_QUEUE_INDEX, index);
    commit(SET_NEXT_SONG_TO_PLAY, {
      song: state.queue[0],
      source: 'Your Queue'
    });
    dispatch(PLAY_CURRENT);
  },

  [RESET_QUEUE]({ commit }) {
    commit(SET_MAIN_SONGS, []);
    commit(SET_MAIN_SONGS_INDEX, -1);
    commit(SET_SHUFFLED_SONGS, []);
    commit(SET_SHUFFLED_SONGS_INDEX, -1);
    commit(SET_YOUR_QUEUE, []);
    commit(SET_NEXT_SONG_TO_PLAY, undefined);
  },

  [SHUFFLE_YOUR_QUEUE]({ commit, state, rootGetters }) {
    const shuffledQueue = rootGetters.isYourQueuePlaying
      ? [state.queue[0], ...shuffle(state.queue.slice(1))]
      : shuffle(state.queue);

    commit(SET_YOUR_QUEUE, shuffledQueue);
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
    if (index < state.mainSongsIndex) {
      state.mainSongsIndex -= 1;
    }

    state.mainSongs.splice(index, 1);
  },

  [REMOVE_FROM_SHUFFLED_MAIN_SONGS](state, index) {
    if (index < state.shuffleSongIndex) {
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
  },

  [MOVE_NEXT_IN_QUEUE](state) {
    state.queue.shift();
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
