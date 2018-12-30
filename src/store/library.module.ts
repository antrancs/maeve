import { ActionTree, MutationTree, GetterTree } from 'vuex';

import musicApiService from '@/services/musicApi.service';
import {
  UserLibraryState,
  AddToLibraryPayload,
  AddSongsToPlaylistPayload,
  CreateNewPlaylistPayload
} from './types';
import {
  ADD_TO_LIBRARY,
  ADD_SONGS_TO_PLAYLIST,
  CREATE_NEW_PLAYLIST,
  FETCH_LIBRARY_SONGS,
  FETCH_LIBRARY_PLAYLISTS,
  FETCH_LIBRARY_ALBUMS
} from './actions.type';
import {
  SET_LIBRARY_ALBUMS,
  SET_LIBRARY_PLAYLISTS,
  APPEND_LIBRARY_PLAYLISTS
} from './mutations.type';

const initialState: UserLibraryState = {
  albums: [],
  playlists: [],
  songs: []
};

const actions: ActionTree<UserLibraryState, any> = {
  [FETCH_LIBRARY_ALBUMS](context): Promise<MusicKit.LibraryAlbum[]> {
    return musicApiService.getLibraryAlbums();
  },

  async [FETCH_LIBRARY_PLAYLISTS](context) {
    const playlists = await musicApiService.getLibraryPlaylists();
    context.commit(SET_LIBRARY_PLAYLISTS, playlists);
  },

  [FETCH_LIBRARY_SONGS](context): Promise<MusicKit.LibrarySong[]> {
    return musicApiService.getLibrarySongs();
  },

  [ADD_TO_LIBRARY](_, { itemIds, type }: AddToLibraryPayload) {
    return musicApiService.addToLibrary(itemIds, type);
  },

  async [ADD_SONGS_TO_PLAYLIST](
    _,
    { songItems, playlistId }: AddSongsToPlaylistPayload
  ) {
    const res = await musicApiService.addSongsToPlaylist(songItems, playlistId);

    if (res.status < 200 || res.status >= 300) {
      throw new Error('Cannot add songs to library');
    }
  },

  async [CREATE_NEW_PLAYLIST](
    { commit },
    { name, description, items }: CreateNewPlaylistPayload
  ) {
    const playlist = await musicApiService.createNewPlaylist(
      name,
      description,
      items
    );

    commit(APPEND_LIBRARY_PLAYLISTS, playlist);
  }
};

const mutations: MutationTree<UserLibraryState> = {
  [SET_LIBRARY_ALBUMS](state, albums: MusicKit.LibraryAlbum[]) {
    state.albums = albums;
  },

  [SET_LIBRARY_PLAYLISTS](state, playlists: MusicKit.LibraryPlaylist[]) {
    state.playlists = playlists;
  },

  [APPEND_LIBRARY_PLAYLISTS](state, newPlaylist: MusicKit.LibraryPlaylist) {
    state.playlists = [newPlaylist, ...state.playlists];
  }
};

export default {
  state: initialState,
  actions,
  mutations
};
