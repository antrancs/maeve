import { NewPlayQueueState, AppendSongsPayload } from './types';
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { PlayQueueSong, PlayQueueNextSongToPlay } from '@/@types/model/model';
import {
  TOGGLE_QUEUE_VISIBILITY,
  MOVE_NEXT_PLAY_QUEUE,
  PREPEND_SONGS_TO_QUEUE,
  APPEND_SONGS_TO_QUEUE,
  REMOVE_FROM_UP_NEXT,
  REMOVE_FROM_HISTORY,
  MOVE_BACK_PLAY_QUEUE
} from './actions.type';
import {
  SET_QUEUE_VISIBILITY,
  SET_MAIN_SONGS,
  SET_MAIN_SONGS_INDEX,
  SET_MAIN_SONGS_SOURCE,
  SET_NEXT_SONG_TO_PLAY,
  REMOVE_FROM_YOUR_QUEUE,
  REMOVE_FROM_MAIN_SONGS
} from './mutations.type';

const initialState: NewPlayQueueState = {
  visibility: false,
  mainSongs: [],
  mainSongsSource: '',
  mainSongsIndex: -1,
  nextSongToPlay: undefined,
  shuffledSongs: [],
  shuffleSongIndex: 0,
  queue: [],
  queueIndex: 0
};

const getters: GetterTree<NewPlayQueueState, any> = {
  upNext(state) {
    return state.mainSongs.slice(state.mainSongsIndex + 1);
  },

  history(state, _, rootState) {
    // When a song from 'Your Queue' is playing, the history will include the current song
    // of the mainSongs
    return rootState.musicPlayer.currentPlayingSource === 'Your Queue'
      ? state.mainSongs.slice(0, state.mainSongsIndex + 1)
      : state.mainSongs.slice(0, state.mainSongsIndex);
  }
};

const actions: ActionTree<NewPlayQueueState, any> = {
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

  [MOVE_NEXT_PLAY_QUEUE]({ state, commit }) {
    // When queue is empty, pick the next item in mainSongs to play
    if (state.queue.length === 0) {
      const nextIndex = state.mainSongsIndex + 1;
      commit(SET_MAIN_SONGS_INDEX, nextIndex);
      commit(SET_NEXT_SONG_TO_PLAY, {
        song: state.mainSongs[state.mainSongsIndex],
        source: state.mainSongsSource
      });
    } else {
      const firstSongInQueue = state.queue.shift();
      commit(SET_NEXT_SONG_TO_PLAY, {
        song: firstSongInQueue,
        source: 'Your Queue'
      });
    }
  },

  [MOVE_BACK_PLAY_QUEUE]({ state, commit }) {
    const prevIndex = state.mainSongsIndex - 1;
    commit(SET_MAIN_SONGS_INDEX, prevIndex);
    commit(SET_NEXT_SONG_TO_PLAY, {
      song: state.mainSongs[state.mainSongsIndex],
      source: state.mainSongsSource
    });
  },

  [REMOVE_FROM_UP_NEXT]({ commit, state }, index: number) {
    commit(REMOVE_FROM_MAIN_SONGS, index + state.mainSongsIndex + 1);
  },

  [REMOVE_FROM_HISTORY]({ commit }, index: number) {
    commit(REMOVE_FROM_MAIN_SONGS, index);
  }
};

const mutations: MutationTree<NewPlayQueueState> = {
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

  [SET_MAIN_SONGS_SOURCE](state, sourceName: string) {
    state.mainSongsSource = sourceName;
  },

  [SET_NEXT_SONG_TO_PLAY](state, { song, source }: PlayQueueNextSongToPlay) {
    state.nextSongToPlay = {
      song,
      source
    };
  },

  [REMOVE_FROM_YOUR_QUEUE](state, index) {
    state.queue.splice(index, 1);
  },

  [REMOVE_FROM_MAIN_SONGS](state, index) {
    if (index <= state.mainSongsIndex) {
      state.mainSongsIndex -= 1;
    }

    state.mainSongs.splice(index, 1);
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
