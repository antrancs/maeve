import { MutationTree, ActionTree } from 'vuex';

import { ContextMenuState, ToggleContextMenuPayload } from '@/store/types';
import {
  SET_SHOWING_CONTEXT_MENU,
  SET_CONTEXT_MENU_DISPLAY_POSITION
} from './mutations.type';
import { TOGGLE_CONTEXT_MENU } from '@/store/actions.type';

const initialState: ContextMenuState = {
  selectedTrack: null,
  isContextMenuShowing: false,
  displayPositionPageX: 0,
  displayPositionPageY: 0
};

const actions: ActionTree<ContextMenuState, any> = {
  [TOGGLE_CONTEXT_MENU](
    { commit, state },
    { pageX, pageY, selectedTrack }: ToggleContextMenuPayload
  ) {
    commit(SET_SHOWING_CONTEXT_MENU, !state.isContextMenuShowing);
    commit(SET_CONTEXT_MENU_DISPLAY_POSITION, { pageX, pageY });
    commit('setSelectedTrack', selectedTrack);
  }
};

const mutations: MutationTree<ContextMenuState> = {
  [SET_SHOWING_CONTEXT_MENU](state, isShowing: boolean) {
    state.isContextMenuShowing = isShowing;
  },
  [SET_CONTEXT_MENU_DISPLAY_POSITION](state, payload) {
    state.displayPositionPageX = payload.pageX;
    state.displayPositionPageY = payload.pageY;
  },
  setSelectedTrack(state, selectedTrack: MusicKit.MediaItem | null) {
    state.selectedTrack = selectedTrack;
  }
};

export default {
  state: initialState,
  mutations,
  actions
};
