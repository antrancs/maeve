import {
  PlayQueueState,
  AppendSongsPayload,
  PrependSongsPayload
} from './types';
import musicPlayerService from '@/services/musicPlayer.service';
import { SET_QUEUE_VISIBILITY, SET_SONG_QUEUE } from './mutations.type';
import { MutationTree, ActionTree } from 'vuex';
import {
  APPEND_SONGS,
  PREPEND_SONGS,
  TOGGLE_QUEUE_VISIBILITY
} from './actions.type';

const initialState: PlayQueueState = {
  visibility: false,
  songs: []
};

const actions: ActionTree<PlayQueueState, any> = {
  [APPEND_SONGS]({ commit }, { items }: AppendSongsPayload) {
    musicPlayerService.appendItemsToQueue(items);
    commit(SET_SONG_QUEUE, musicPlayerService.queuedSongs);
  },

  [PREPEND_SONGS]({ commit }, { items }: PrependSongsPayload) {
    musicPlayerService.prependItems(items);
    commit(SET_SONG_QUEUE, musicPlayerService.queuedSongs);
  },

  [TOGGLE_QUEUE_VISIBILITY]({ state, commit }) {
    const visibility = !state.visibility;
    commit(SET_QUEUE_VISIBILITY, visibility);
  }
};

const mutations: MutationTree<PlayQueueState> = {
  [SET_QUEUE_VISIBILITY](state, visibility: boolean) {
    state.visibility = visibility;
  },

  [SET_SONG_QUEUE](state, songs: MusicKit.MediaItem[]) {
    state.songs = songs;
  }
};

export default {
  state: initialState,
  mutations,
  actions
};
