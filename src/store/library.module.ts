import { ActionTree, MutationTree } from 'vuex';

import musicKit from '@/services/musicKit';
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
  FETCH_LIBRARY_ALBUMS,
  FETCH_ONE_ALBUM_LIBRARY,
  FETCH_ONE_PLAYLIST_LIBRARY
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
  async [FETCH_ONE_ALBUM_LIBRARY](_, id: string) {
    return await musicKit
      .getApiInstance()
      .library.album(id, { include: 'tracks' });
  },

  async [FETCH_ONE_PLAYLIST_LIBRARY](_, id: string) {
    return await musicKit.getApiInstance().library.playlist(id, {
      include: 'tracks'
    });
  },

  [FETCH_LIBRARY_ALBUMS](): Promise<MusicKit.LibraryAlbum[]> {
    return musicKit.getApiInstance().library.albums();
  },

  async [FETCH_LIBRARY_PLAYLISTS](context) {
    const playlists = await musicKit.getApiInstance().library.playlists();
    context.commit(SET_LIBRARY_PLAYLISTS, playlists);
  },

  [FETCH_LIBRARY_SONGS](): Promise<MusicKit.LibrarySong[]> {
    return musicKit.getApiInstance().library.songs(undefined, {
      include: 'albums,artists'
    });
  },

  [ADD_TO_LIBRARY](_, { itemIds, type }: AddToLibraryPayload) {
    return musicKit.getApiInstance().addToLibrary({
      [type]: itemIds
    });
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
