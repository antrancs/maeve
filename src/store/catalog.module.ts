import { ActionTree, MutationTree, GetterTree } from 'vuex';

import musicKit from '@/services/musicKit';
import {
  FETCH_ONE_ALBUM_CATALOG,
  FETCH_ONE_PLAYLIST_CATALOG,
  FETCH_MULTIPLE_PLAYLISTS_CATALOG
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

  [FETCH_MULTIPLE_PLAYLISTS_CATALOG](_, ids: string[]) {
    return musicKit.getApiInstance().playlists(ids);
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
