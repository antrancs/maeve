import { GetterTree, ActionTree, MutationTree } from 'vuex';

import { PlayQueueState, AppendSongsPayload } from './types';
import {
  TOGGLE_QUEUE_VISIBILITY,
  PREPEND_SONGS_TO_QUEUE,
  APPEND_SONGS_TO_QUEUE,
  RESET_QUEUE
} from './actions.type';
import { SET_QUEUE_VISIBILITY, SET_QUEUE } from './mutations.type';
import musicKit from '@/services/musicKit';

const musicKitPlayer = musicKit.getPlayerInstance();

const initialState: PlayQueueState = {
  queue: null,
  visibility: false
};

const getters: GetterTree<PlayQueueState, any> = {
  upNext({ queue }): MusicKit.MediaItem[] {
    if (!queue) {
      return [];
    }

    return queue.items.slice(queue.position);
  },

  canGoBack({ queue }): boolean {
    return queue !== null && queue.previousPlayableItem !== undefined;
  },

  canGoNext({ queue }): boolean {
    return queue !== null && queue.nextPlayableItem !== undefined;
  },

  nextSong({ queue }) {
    return queue ? queue.nextPlayableItem : null;
  },

  previousSong({ queue }) {
    return queue ? queue.nextPlayableItem : null;
  }
};

const actions: ActionTree<PlayQueueState, any> = {
  [PREPEND_SONGS_TO_QUEUE](
    { state, rootGetters },
    { items }: AppendSongsPayload
  ) {
    if (!state.queue) {
      return;
    }

    state.queue.prepend({
      items
    });
  },

  [APPEND_SONGS_TO_QUEUE]({ state }, { items }: AppendSongsPayload) {
    if (!state.queue) {
      return;
    }
    state.queue.append({
      items
    });
  },

  [TOGGLE_QUEUE_VISIBILITY]({ state, commit }) {
    const visibility = !state.visibility;
    commit(SET_QUEUE_VISIBILITY, visibility);
  },

  removeFromQueue({ state }, index: number) {
    if (!state.queue) {
      return;
    }

    state.queue.remove(state.queue.position + index);
  },

  moveToIndexInQueue({ state }, index: number) {
    if (!state.queue) {
      return;
    }

    musicKitPlayer.changeToMediaAtIndex(state.queue.position + index);
  },

  [RESET_QUEUE]({ commit }) {
    // commit(SET_SHUFFLED_SONGS, []);
    // commit(SET_SHUFFLED_SONGS_INDEX, -1);
    // commit(SET_YOUR_QUEUE, []);
    // commit(SET_NEXT_SONG_TO_PLAY, undefined);
  }
};

const mutations: MutationTree<PlayQueueState> = {
  [SET_QUEUE_VISIBILITY](state, visibility: boolean) {
    state.visibility = visibility;
  },

  [SET_QUEUE](state, queue: MusicKit.Queue) {
    state.queue = queue;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
