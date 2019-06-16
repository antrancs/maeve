import {
  SET_THEME_EDITOR_DIALOG_VISIBILITY,
  SET_THEME_EDITOR_DIALOG_THEME_TO_EDIT
} from './mutations.type';
import { MutationTree, ActionTree } from 'vuex';
import { ThemeOption } from '@/@types/model/model';
import { ThemeEditorDialogState, OpenThemeEditorDialogPayload } from './types';
import {
  OPEN_THEME_EDITOR_DIALOG,
  CLOSE_THEME_EDITOR_DIALOG
} from './actions.type';

const initialState: ThemeEditorDialogState = {
  visibility: false
};

const actions: ActionTree<ThemeEditorDialogState, any> = {
  [OPEN_THEME_EDITOR_DIALOG](
    { commit },
    payload: OpenThemeEditorDialogPayload
  ) {
    commit(SET_THEME_EDITOR_DIALOG_VISIBILITY, true);

    if (payload && payload.themeToEdit) {
      commit(SET_THEME_EDITOR_DIALOG_THEME_TO_EDIT, payload.themeToEdit);
    }
  },

  [CLOSE_THEME_EDITOR_DIALOG]({ commit }) {
    commit(SET_THEME_EDITOR_DIALOG_THEME_TO_EDIT, undefined);
    commit(SET_THEME_EDITOR_DIALOG_VISIBILITY, false);
  }
};

const mutations: MutationTree<ThemeEditorDialogState> = {
  [SET_THEME_EDITOR_DIALOG_VISIBILITY](state, value: boolean) {
    state.visibility = value;
  },

  [SET_THEME_EDITOR_DIALOG_THEME_TO_EDIT](
    state,
    theme: ThemeOption | undefined
  ) {
    state.themeToEdit = theme;
  }
};

export default {
  state: initialState,
  actions,
  mutations
};
