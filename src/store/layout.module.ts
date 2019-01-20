import { LayoutState } from './types';
import { MutationTree } from 'vuex';

import { SET_FOOTER_VISIBILITY } from './mutations.type';

const initialState: LayoutState = {
  showFooter: true
};

const mutations: MutationTree<LayoutState> = {
  [SET_FOOTER_VISIBILITY](state, visibility: boolean) {
    state.showFooter = visibility;
  }
};

export default {
  state: initialState,
  mutations
};
