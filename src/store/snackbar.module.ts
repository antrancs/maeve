import { SnackbarState, ShowSnackbarActionPayload } from './types';
import { MutationTree, ActionTree } from 'vuex';
import { SHOW_SNACKBAR, CLOSE_SNACKBAR } from './actions.type';
import { SET_SNACKBAR_VISIBILITY, SET_SNACKBAR_TEXT } from './mutations.type';

const initialState: SnackbarState = {
  visibility: false,
  text: '',
  timeout: 2000,
  type: 'success'
};

const actions: ActionTree<SnackbarState, any> = {
  [SHOW_SNACKBAR]({ commit }, payload: ShowSnackbarActionPayload) {
    const { text, type } = payload;

    console.log('SHOW_SNACKBAR');
    commit(SET_SNACKBAR_VISIBILITY, true);
    commit(SET_SNACKBAR_TEXT, text);
  },

  [CLOSE_SNACKBAR]({ commit }) {
    commit(SET_SNACKBAR_VISIBILITY, false);
    commit(SET_SNACKBAR_TEXT, '');
  }
};

const mutations: MutationTree<SnackbarState> = {
  [SET_SNACKBAR_VISIBILITY](state, visibility: boolean) {
    state.visibility = visibility;
  },

  [SET_SNACKBAR_TEXT](state, text: string) {
    state.text = text;
  }
};

export default {
  state: initialState,
  actions,
  mutations
};
