import { SnackbarState, ShowSnackbarActionPayload } from './types';
import { MutationTree, ActionTree } from 'vuex';
import { SHOW_SNACKBAR, CLOSE_SNACKBAR } from './actions.type';
import {
  SET_SNACKBAR_VISIBILITY,
  SET_SNACKBAR_TEXT,
  SET_SNACKBAR_TYPE
} from './mutations.type';
import { SnackbarMode } from '@/@types/model/model';

const initialState: SnackbarState = {
  visibility: false,
  text: '',
  timeout: 3000,
  type: 'success'
};

const actions: ActionTree<SnackbarState, any> = {
  [SHOW_SNACKBAR](
    { commit },
    { text, type = SnackbarMode.success }: ShowSnackbarActionPayload
  ) {
    commit(SET_SNACKBAR_VISIBILITY, true);
    commit(SET_SNACKBAR_TEXT, text);
    commit(SET_SNACKBAR_TYPE, type);
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
  },

  [SET_SNACKBAR_TYPE](state, type: string) {
    state.type = type;
  }
};

export default {
  state: initialState,
  actions,
  mutations
};
