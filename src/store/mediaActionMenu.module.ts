import { MediaActionMenuState, ShowMediaActionMenuPayload } from './types';
import { ActionTree, MutationTree } from 'vuex';
import {
  SHOW_MEDIA_ACTION_MENU,
  CLOSE_MEDIA_ACTION_MENU
} from './actions.type';
import {
  SET_MEDIA_ACTION_MENU_VISIBILITY,
  SET_MEDIA_ACTION_MENU_POSITION,
  SET_MEDIA_ACTION_MENU_ITEM,
  SET_MEDIA_ACTION_MENU_IS_QUEUE
} from './mutations.type';
import { Collection, Song } from '@/@types/model/model';

const initialState: MediaActionMenuState = {
  visibility: false,
  posX: 0,
  posY: 0,
  isQueue: false
};

const actions: ActionTree<MediaActionMenuState, any> = {
  [SHOW_MEDIA_ACTION_MENU]({ commit }, payload: ShowMediaActionMenuPayload) {
    commit(SET_MEDIA_ACTION_MENU_POSITION, {
      posX: payload.posX,
      posY: payload.posY
    });
    commit(SET_MEDIA_ACTION_MENU_VISIBILITY, true);
    commit(SET_MEDIA_ACTION_MENU_ITEM, payload.item);
    commit(SET_MEDIA_ACTION_MENU_IS_QUEUE, payload.isQueue);
  },

  [CLOSE_MEDIA_ACTION_MENU]({ commit }) {
    commit(SET_MEDIA_ACTION_MENU_POSITION, {
      posX: 0,
      posY: 0
    });
    commit(SET_MEDIA_ACTION_MENU_VISIBILITY, false);
    commit(SET_MEDIA_ACTION_MENU_IS_QUEUE, false);
    commit(SET_MEDIA_ACTION_MENU_ITEM, undefined);
  }
};

const mutations: MutationTree<MediaActionMenuState> = {
  [SET_MEDIA_ACTION_MENU_POSITION](
    state,
    payload: { posX: number; posY: number }
  ) {
    state.posX = payload.posX;
    state.posY = payload.posY;
  },

  [SET_MEDIA_ACTION_MENU_VISIBILITY](state, value: boolean) {
    state.visibility = value;
  },

  [SET_MEDIA_ACTION_MENU_ITEM](
    state,
    item: Collection | Song | MusicKit.MediaItem | undefined
  ) {
    state.item = item;
  },

  [SET_MEDIA_ACTION_MENU_IS_QUEUE](state, isQueue: boolean) {
    state.isQueue = isQueue;
  }
};

export default {
  state: initialState,
  actions,
  mutations
};
