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
  SELECT_BUTTON_STYLES,
  BLOCK_ARTISTS,
  UNBLOCK_ARTISTS,
  BLOCK_SONG,
  UNBLOCK_SONG,
  LOAD_BLOCKED_ITEMS
} from './actions.type';
import {
  ADD_ONE_THEME,
  DELETE_THEME_MUTATION,
  SET_CUSTOM_THEMES,
  SET_THEME,
  SET_SELECTED_THEME,
  SET_BUTTON_STYLE,
  ADD_BLOCKED_ARTISTS,
  REMOVE_BLOCKED_ARTISTS,
  SET_BLOCKED_ARTISTS,
  ADD_BLOCKED_SONG,
  REMOVE_BLOCKED_SONG,
  SET_BLOCKED_SONGS
} from './mutations.type';
import Vue from 'vue';
import { ButtonStyle } from '@/utils/constants';
import {
  blockSong,
  unblockSong,
  loadBlockedSongs,
  blockArtists,
  unblockArtists,
  loadBlockedArtists
} from '@/services/lastfm.service';

const MAEVE_CUSTOM_THEMES = 'MAEVE_CUSTOM_THEMES';
const MAEVE_SELECTED_THEME = 'MAEVE_SELECTED_THEME';
const MAEVE_BUTTON_STYLE = 'MAEVE_BUTTON_STYLE';
const MAEVE_BLOCKED_ARTISTS = 'MAEVE_BLOCKED_ARTISTS';
const MAEVE_BLOCKED_SONGS = 'MAEVE_BLOCKED_SONGS';

const initialState: SettingsState = {
  defaultThemes,
  buttonStyle: ButtonStyle.normal,
  customThemes: [],
  selectedTheme: defaultThemes[0], // the first theme is the default,
  // Would be ideal to use Set, but Set is not reactive in Vue. So, use an object to
  // quickly lookup blocked artists/songs
  blockedArtists: {},
  blockedSongs: {}
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

  async [BLOCK_ARTISTS]({ state, commit, rootState }, artistIds: string[]) {
    commit(ADD_BLOCKED_ARTISTS, artistIds);

    try {
      if (rootState.lastfm.token.length > 0) {
        await blockArtists(artistIds, rootState.lastfm.token);
      }

      localStorage.setItem(
        MAEVE_BLOCKED_ARTISTS,
        JSON.stringify(state.blockedArtists)
      );
    } catch (err) {
      commit(REMOVE_BLOCKED_ARTISTS, artistIds);
    }
  },

  async [UNBLOCK_ARTISTS]({ commit, state, rootState }, artistIds: string[]) {
    commit(REMOVE_BLOCKED_ARTISTS, artistIds);

    try {
      if (rootState.lastfm.token.length > 0) {
        await unblockArtists(artistIds, rootState.lastfm.token);
      }

      localStorage.setItem(
        MAEVE_BLOCKED_ARTISTS,
        JSON.stringify(state.blockedArtists)
      );
    } catch (err) {
      commit(ADD_BLOCKED_ARTISTS, artistIds);
    }
  },

  async [BLOCK_SONG]({ state, commit, rootState }, songId: string) {
    commit(ADD_BLOCKED_SONG, songId);
    // only call the Lastfm API if the user has logged in
    // otherwise, just save the blocked items in localStorage
    try {
      if (rootState.lastfm.token.length > 0) {
        await blockSong(songId, rootState.lastfm.token);
      }

      localStorage.setItem(
        MAEVE_BLOCKED_SONGS,
        JSON.stringify(state.blockedSongs)
      );
    } catch (err) {
      commit(REMOVE_BLOCKED_SONG, songId);
    }
  },

  async [UNBLOCK_SONG]({ state, commit, rootState }, songId: string) {
    commit(REMOVE_BLOCKED_SONG, songId);

    try {
      // only call the Lastfm API if the user has logged in
      // otherwise, just save the blocked items in localStorage
      if (rootState.lastfm.token.length > 0) {
        await unblockSong(songId, rootState.lastfm.token);
      }

      localStorage.setItem(
        MAEVE_BLOCKED_SONGS,
        JSON.stringify(state.blockedSongs)
      );
    } catch (err) {
      commit(ADD_BLOCKED_SONG, songId);
    }
  },

  [SELECT_THEME]({ state, commit }, { theme }: SelectThemeActionPayload) {
    localStorage.setItem(
      MAEVE_SELECTED_THEME,
      JSON.stringify({ id: theme.id })
    );

    commit(SET_SELECTED_THEME, theme);
  },

  [LOAD_SETTINGS]({ commit, getters, dispatch, rootState }) {
    const selectedThemeStr = localStorage.getItem(MAEVE_SELECTED_THEME);
    const buttonStyle = localStorage.getItem(MAEVE_BUTTON_STYLE);

    if (selectedThemeStr) {
      const selectedThemeId =
        JSON.parse(selectedThemeStr).id || defaultThemes[0].id;

      const selectedTheme =
        getters.themes.find(
          (theme: ThemeOption) => theme.id === selectedThemeId
        ) || defaultThemes[0];

      commit(SET_SELECTED_THEME, selectedTheme);
    }

    if (buttonStyle) {
      commit(SET_BUTTON_STYLE, buttonStyle);
    }

    if (rootState.lastfm.token.length === 0) {
      dispatch(LOAD_BLOCKED_ITEMS);
    }
  },

  async [LOAD_BLOCKED_ITEMS]({ commit, rootState }) {
    // blocked artists
    let blockedArtists: {
      [id: string]: boolean;
    };

    if (rootState.lastfm.token.length > 0) {
      // this should return an array of ids
      const blockedArtistsArray = await loadBlockedArtists(
        rootState.lastfm.token
      );

      // convert the array into an object
      blockedArtists = blockedArtistsArray.reduce(
        (accumulate: any, current: string) => {
          accumulate[current] = true;
          return accumulate;
        },
        {}
      );

      // save to localStorage
      localStorage.setItem(
        MAEVE_BLOCKED_ARTISTS,
        JSON.stringify(blockedArtists)
      );
    } else {
      blockedArtists = JSON.parse(
        localStorage.getItem(MAEVE_BLOCKED_ARTISTS) || '{}'
      );
    }

    if (blockedArtists) {
      commit(SET_BLOCKED_ARTISTS, blockedArtists);
    }

    // blocked songs
    let blockedSongs: {
      [id: string]: boolean;
    };

    if (rootState.lastfm.token.length > 0) {
      // this should return an array of ids
      const blockedSongsArray = await loadBlockedSongs(rootState.lastfm.token);

      // convert the array into an object
      blockedSongs = blockedSongsArray.reduce(
        (accumulate: any, current: string) => {
          accumulate[current] = true;
          return accumulate;
        },
        {}
      );

      // save to localStorage
      localStorage.setItem(MAEVE_BLOCKED_SONGS, JSON.stringify(blockedSongs));
    } else {
      blockedSongs = JSON.parse(
        localStorage.getItem(MAEVE_BLOCKED_SONGS) || '{}'
      );
    }

    if (blockedSongs) {
      commit(SET_BLOCKED_SONGS, blockedSongs);
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
  },

  [ADD_BLOCKED_ARTISTS](state, artistIds: string[]) {
    artistIds.forEach(artistId => {
      Vue.set(state.blockedArtists, artistId, true);
    });
  },

  [REMOVE_BLOCKED_ARTISTS](state, artistIds: string[]) {
    artistIds.forEach(artistId => Vue.delete(state.blockedArtists, artistId));
  },

  [SET_BLOCKED_ARTISTS](
    state,
    artistIds: {
      [id: string]: boolean;
    }
  ) {
    state.blockedArtists = artistIds;
  },

  [ADD_BLOCKED_SONG](state, songId: string) {
    Vue.set(state.blockedSongs, songId, true);
  },

  [REMOVE_BLOCKED_SONG](state, songId: string) {
    Vue.delete(state.blockedSongs, songId);
  },

  [SET_BLOCKED_SONGS](
    state,
    songIds: {
      [id: string]: boolean;
    }
  ) {
    state.blockedSongs = songIds;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
