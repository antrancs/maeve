import { ActionTree, MutationTree } from 'vuex';

import musicKit from '@/services/musicKit';
import musicApiService from '@/services/musicApi.service';

import {
  UserLibraryState,
  AddToLibraryPayload,
  AddSongsToPlaylistPayload,
  CreateNewPlaylistPayload,
  FetchResult,
  SearchParams
} from './types';
import {
  ADD_TO_LIBRARY,
  ADD_SONGS_TO_PLAYLIST,
  CREATE_NEW_PLAYLIST,
  FETCH_LIBRARY_SONGS,
  FETCH_LIBRARY_PLAYLISTS,
  FETCH_LIBRARY_ALBUMS,
  FETCH_ONE_ALBUM_LIBRARY,
  FETCH_ONE_PLAYLIST_LIBRARY,
  FETCH_LIBRARY_ARTISTS,
  FETCH_ONE_ARTIST_LIBRARY
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

  async [FETCH_ONE_ARTIST_LIBRARY](_, id: string) {
    return await musicKit.getApiInstance().library.artist(id, {
      include: 'albums,playlists'
    });
  },

  async [FETCH_LIBRARY_ALBUMS](
    _,
    { offset, limit }: SearchParams
  ): Promise<FetchResult<MusicKit.LibraryAlbum>> {
    const albums = await musicKit.getApiInstance().library.albums(undefined, {
      offset,
      limit
    });

    const hasNext = albums.length === limit;
    const hasNoData = albums.length === 0 && offset === 0;

    return {
      data: albums,
      hasNext,
      hasNoData
    };
  },

  async [FETCH_LIBRARY_PLAYLISTS](
    { commit },
    { offset, limit }: SearchParams
  ): Promise<FetchResult<MusicKit.LibraryPlaylist>> {
    const playlists = await musicKit
      .getApiInstance()
      .library.playlists(undefined, {
        offset,
        limit
      });
    commit(SET_LIBRARY_PLAYLISTS, playlists);

    const hasNext = playlists.length === limit;
    const hasNoData = playlists.length === 0 && offset === 0;

    return {
      data: playlists,
      hasNext,
      hasNoData
    };
  },

  async [FETCH_LIBRARY_ARTISTS](
    _,
    { offset, limit }: SearchParams
  ): Promise<FetchResult<MusicKit.LibraryArtist>> {
    const artists = await musicKit.getApiInstance().library.artists(undefined, {
      offset,
      limit
    });

    const hasNext = artists.length === limit;
    const hasNoData = artists.length === 0 && offset === 0;

    return {
      data: artists,
      hasNext,
      hasNoData
    };
  },

  async [FETCH_LIBRARY_SONGS](
    _,
    { offset, limit }: SearchParams
  ): Promise<FetchResult<MusicKit.LibrarySong>> {
    const songs = await musicKit.getApiInstance().library.songs(undefined, {
      offset,
      limit
    });

    const hasNext = songs.length === limit;
    const hasNoData = songs.length === 0 && offset === 0;

    return {
      data: songs,
      hasNext,
      hasNoData
    };
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
  },

  searchLibrary(_, searchTerm: string) {
    return musicKit.getApiInstance().library.search(searchTerm, {
      types: ['library-albums'],
      limit: 25,
      offset: 0
    });
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
