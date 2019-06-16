import { NewPlaylistDialogState, OpenNewPlaylistDialogPayload } from './types';
import { MutationTree, ActionTree } from 'vuex';
import {
  SET_NEW_PLAYLIST_DIALOG_VISIBILITY,
  SET_NEW_PLAYLIST_DIALOG_ITEMS_TO_ADD
} from './mutations.type';
import {
  OPEN_NEW_PLAYLIST_DIALOG,
  CLOSE_NEW_PLAYLIST_DIALOG
} from './actions.type';
import { Song } from '@/@types/model/model';

const initialState: NewPlaylistDialogState = {
  visibility: false
};

const actions: ActionTree<NewPlaylistDialogState, any> = {
  [OPEN_NEW_PLAYLIST_DIALOG](
    { commit },
    payload: OpenNewPlaylistDialogPayload
  ) {
    commit(SET_NEW_PLAYLIST_DIALOG_VISIBILITY, true);

    if (payload && payload.itemsToAdd && Array.isArray(payload.itemsToAdd)) {
      commit(SET_NEW_PLAYLIST_DIALOG_ITEMS_TO_ADD, payload.itemsToAdd);
    }
  },

  [CLOSE_NEW_PLAYLIST_DIALOG]({ commit }) {
    commit(SET_NEW_PLAYLIST_DIALOG_ITEMS_TO_ADD, undefined);
    commit(SET_NEW_PLAYLIST_DIALOG_VISIBILITY, false);
  }
};

const mutations: MutationTree<NewPlaylistDialogState> = {
  [SET_NEW_PLAYLIST_DIALOG_VISIBILITY](state, value: boolean) {
    state.visibility = value;
  },

  [SET_NEW_PLAYLIST_DIALOG_ITEMS_TO_ADD](
    state,
    items: (Song | MusicKit.MediaItem)[] | undefined
  ) {
    state.itemsToAdd = items;
  }
};

export default {
  state: initialState,
  actions,
  mutations
};
