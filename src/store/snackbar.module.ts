import {
  SnackbarState,
  ShowSnackbarActionPayload,
  SetSnackbarActionMutationPayload
} from './types';
import { MutationTree, ActionTree } from 'vuex';
import { SHOW_SNACKBAR, CLOSE_SNACKBAR } from './actions.type';
import {
  SET_SNACKBAR_VISIBILITY,
  SET_SNACKBAR_TEXT,
  SET_SNACKBAR_TYPE,
  SET_SNACKBAR_ACTION,
  SET_SNACKBAR_TIMEOUT
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
    {
      text,
      type = SnackbarMode.success,
      action,
      timeout = 3000
    }: ShowSnackbarActionPayload
  ) {
    commit(SET_SNACKBAR_VISIBILITY, true);
    commit(SET_SNACKBAR_TEXT, text);
    commit(SET_SNACKBAR_TYPE, type);
    commit(SET_SNACKBAR_ACTION, action);
    commit(SET_SNACKBAR_TIMEOUT, timeout);
  },

  [CLOSE_SNACKBAR]({ commit }) {
    commit(SET_SNACKBAR_VISIBILITY, false);
    commit(SET_SNACKBAR_TEXT, '');
    commit(SET_SNACKBAR_ACTION, undefined);
  }
};

const mutations: MutationTree<SnackbarState> = {
  [SET_SNACKBAR_VISIBILITY](state, visibility: boolean) {
    state.visibility = visibility;
  },

  [SET_SNACKBAR_TEXT](state, text: string) {
    state.text = text;
  },

  [SET_SNACKBAR_TIMEOUT](state, timeout: number) {
    state.timeout = timeout;
  },

  [SET_SNACKBAR_TYPE](state, type: string) {
    state.type = type;
  },

  [SET_SNACKBAR_ACTION](state, action: SetSnackbarActionMutationPayload) {
    state.action = action;
  }
};

export default {
  state: initialState,
  actions,
  mutations
};
