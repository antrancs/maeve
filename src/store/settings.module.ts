import { ActionTree, MutationTree, GetterTree } from 'vuex';

import {
  SettingsState,
  CreateNewThemeActionPayload,
  SetThemeMutationPayload,
  UpdateThemeActionPayload,
  SelectThemeActionPayload
} from './types';
import { ThemeOption } from '@/@types/model/model';
import { defaultThemes, isLight } from '@/themes';
import {
  CREATE_THEME,
  UPDATE_THEME,
  DELETE_THEME,
  LOAD_CUSTOM_THEME,
  SELECT_THEME,
  LOAD_SETTINGS,
  SELECT_BUTTON_STYLES
} from './actions.type';
import {
  ADD_ONE_THEME,
  DELETE_THEME_MUTATION,
  SET_CUSTOM_THEMES,
  SET_THEME,
  SET_SELECTED_THEME,
  SET_BUTTON_STYLE
} from './mutations.type';
import Vue from 'vue';
import { ButtonStyle } from '@/utils/constants';

const MAEVE_CUSTOM_THEMES = 'MAEVE_CUSTOM_THEMES';
const MAEVE_SELECTED_THEME = 'MAEVE_SELECTED_THEME';
const MAEVE_BUTTON_STYLE = 'MAEVE_BUTTON_STYLE';

const initialState: SettingsState = {
  defaultThemes,
  buttonStyle: ButtonStyle.normal,
  customThemes: [],
  selectedTheme: defaultThemes[0] // the first theme is the default
};

const getters: GetterTree<SettingsState, any> = {
  themes(state): ThemeOption[] {
    return state.defaultThemes.concat(state.customThemes);
  },

  darkMode(state): boolean {
    return !isLight(state.selectedTheme.primary);
  }
};

const actions: ActionTree<SettingsState, any> = {
  [CREATE_THEME]({ state, commit }, payload: CreateNewThemeActionPayload) {
    const {
      accent,
      primary,
      secondary,
      name,
      primaryText,
      secondaryText
    } = payload;
    const id = `Theme-${Date.now()}`;

    const newTheme: ThemeOption = {
      id,
      accent,
      name,
      primary,
      secondary,
      primaryText,
      secondaryText,
      editable: true
    };

    commit(ADD_ONE_THEME, newTheme);
    localStorage.setItem(
      MAEVE_CUSTOM_THEMES,
      JSON.stringify(state.customThemes)
    );
  },

  [UPDATE_THEME](
    { state, commit, dispatch },
    { theme }: UpdateThemeActionPayload
  ) {
    commit(SET_THEME, {
      id: theme.id,
      theme
    });

    localStorage.setItem(
      MAEVE_CUSTOM_THEMES,
      JSON.stringify(state.customThemes)
    );

    if (theme.id === state.selectedTheme.id) {
      dispatch(SELECT_THEME, { theme });
    }
  },

  [DELETE_THEME]({ state, commit }, themeId: string) {
    commit(DELETE_THEME_MUTATION, themeId);
    localStorage.setItem(
      MAEVE_CUSTOM_THEMES,
      JSON.stringify(state.customThemes)
    );
  },

  [LOAD_CUSTOM_THEME](context) {
    const cutomThemes = JSON.parse(
      localStorage.getItem(MAEVE_CUSTOM_THEMES) || '[]'
    );

    context.commit(SET_CUSTOM_THEMES, cutomThemes);
  },

  [SELECT_THEME]({ state, commit }, { theme }: SelectThemeActionPayload) {
    localStorage.setItem(MAEVE_SELECTED_THEME, JSON.stringify(theme));

    commit(SET_SELECTED_THEME, theme);
  },

  [LOAD_SETTINGS]({ commit }) {
    const selectedTheme = localStorage.getItem(MAEVE_SELECTED_THEME);
    const buttonStyle = localStorage.getItem(MAEVE_BUTTON_STYLE);

    if (selectedTheme) {
      commit(SET_SELECTED_THEME, JSON.parse(selectedTheme));
    }

    if (buttonStyle) {
      commit(SET_BUTTON_STYLE, buttonStyle);
    }
  },

  [SELECT_BUTTON_STYLES](context, buttonStyle: ButtonStyle) {
    localStorage.setItem(MAEVE_BUTTON_STYLE, buttonStyle);
    context.commit(SET_BUTTON_STYLE, buttonStyle);
  }
};

const mutations: MutationTree<SettingsState> = {
  [ADD_ONE_THEME](state, theme: ThemeOption) {
    state.customThemes.push(theme);
  },

  [SET_CUSTOM_THEMES](state, themes: ThemeOption[]) {
    state.customThemes = themes;
  },

  [SET_THEME](state, { id, theme }: SetThemeMutationPayload) {
    const themeToUpdate = state.customThemes.find(theme => theme.id === id);

    if (themeToUpdate) {
      // themeToUpdate.name = theme.name;
      // themeToUpdate.primary = theme.primary;
      // themeToUpdate.secondary = theme.secondary;
      // themeToUpdate.accent = theme.accent;

      Vue.set(themeToUpdate, 'name', theme.name);
      Vue.set(themeToUpdate, 'primary', theme.primary);
      Vue.set(themeToUpdate, 'secondary', theme.secondary);
      Vue.set(themeToUpdate, 'accent', theme.accent);
      Vue.set(themeToUpdate, 'primaryText', theme.primaryText);
      Vue.set(themeToUpdate, 'secondaryText', theme.secondaryText);
    }
  },

  [DELETE_THEME_MUTATION](state, themeId: string) {
    state.customThemes = state.customThemes.filter(
      theme => theme.id !== themeId
    );
  },

  [SET_SELECTED_THEME](state, theme: ThemeOption) {
    state.selectedTheme = theme;
  },

  [SET_BUTTON_STYLE](state, buttonStyle: ButtonStyle) {
    state.buttonStyle = buttonStyle;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
