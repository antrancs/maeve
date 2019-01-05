import { ActionTree, MutationTree, GetterTree } from 'vuex';

import musicKit from '@/services/musicKit';
import {
  FETCH_ONE_ALBUM_CATALOG,
  FETCH_ONE_PLAYLIST_CATALOG
} from './actions.type';
import { CatalogState } from './types';

const initialState: CatalogState = {};

const actions: ActionTree<CatalogState, any> = {
  async [FETCH_ONE_ALBUM_CATALOG](_, id: string) {
    return await musicKit.getApiInstance().album(id, { include: 'tracks' });
  },

  async [FETCH_ONE_PLAYLIST_CATALOG](_, id: string) {
    return await musicKit.getApiInstance().playlist(id, {
      include: 'tracks,artists'
    });
  },

  async fetchCatalogSongsDetails(_, ids?: string[]) {
    return await musicKit.getApiInstance().songs(ids || []);
  }
};

const mutations: MutationTree<CatalogState> = {};

export default {
  state: initialState,
  actions,
  mutations
};
