import { SongQueueState } from './types';
import { TOGGLE_QUEUE_VISIBILITY } from './mutations.type';
import { MutationTree } from 'vuex';

const initialState: SongQueueState = {
  visibility: false
};

const mutations: MutationTree<SongQueueState> = {
  [TOGGLE_QUEUE_VISIBILITY](state) {
    state.visibility = !state.visibility;
  }
};

export default {
  state: initialState,
  mutations
};
