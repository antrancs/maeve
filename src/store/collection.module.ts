import { ActionTree, MutationTree, GetterTree } from 'vuex';

import musicApiService from '@/services/musicApi.service';
import { Collection, Song, CollectionType } from '@/@types/model/model';
import { CollectionState, FetchCollectionPayload } from './types';
import { FETCH_COLLECTION } from './actions.type';

const initialState: CollectionState = {
  collection: null
};

const getters: GetterTree<CollectionState, any> = {
  songs({ collection }): Song[] {
    let songs: Song[] = [];
    if (
      collection &&
      collection.relationships &&
      collection.relationships.tracks
    ) {
      songs = collection.relationships.tracks.data;
    }

    return songs;
  }
};

const actions: ActionTree<CollectionState, any> = {
  [FETCH_COLLECTION](
    { commit },
    { collectionId, collectionType }: FetchCollectionPayload
  ) {
    commit('setCollection', null);
    let promise: Promise<Collection>;

    switch (collectionType) {
      case CollectionType.libraryPlaylist:
      case CollectionType.libraryAlbum:
        promise = musicApiService.getLibraryCollection(
          collectionId,
          collectionType
        );
        break;

      case CollectionType.album:
      case CollectionType.playlist:
        promise = musicApiService.getCollection(collectionId, collectionType);
        break;

      default:
        promise = Promise.reject('Invalid collection type');
    }

    return promise.then(collection => {
      commit('setCollection', collection);
    });
  }
};

const mutations: MutationTree<CollectionState> = {
  setCollection(state, collection: Collection) {
    state.collection = collection;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
