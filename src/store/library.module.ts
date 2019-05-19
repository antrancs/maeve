import { ActionTree, MutationTree } from 'vuex';

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
  FETCH_ONE_ARTIST_LIBRARY,
  LOGOUT,
  FETCH_HEAVY_ROTATION,
  FETCH_RECOMMENDATIONS,
  FETCH_RECENT_PLAYED,
  FETCH_LIBRARY_PLAYLIST_TRACKS,
  FETCH_RECENTLY_ADDED
} from './actions.type';
import {
  SET_LIBRARY_ALBUMS,
  SET_LIBRARY_PLAYLISTS,
  APPEND_LIBRARY_PLAYLISTS
} from './mutations.type';
import {
  getLibraryPlaylist,
  getLibraryPlaylistTracks,
  getHeavyRotation,
  getRecentlyAdded,
  addSongsToPlaylist,
  createNewPlaylist
} from '@/services/musicApi.service';

const initialState: UserLibraryState = {
  albums: [],
  playlists: [],
  songs: []
};

const actions: ActionTree<UserLibraryState, any> = {
  async [FETCH_ONE_ALBUM_LIBRARY](_, id: string) {
    return await MusicKit.getInstance().api.library.album(id, {
      include: 'tracks'
    });
  },

  [FETCH_ONE_PLAYLIST_LIBRARY](_, id: string) {
    return getLibraryPlaylist(id);
  },

  [FETCH_LIBRARY_PLAYLIST_TRACKS](_, id: string) {
    return getLibraryPlaylistTracks(id);
  },

  async [FETCH_ONE_ARTIST_LIBRARY](_, id: string) {
    return await MusicKit.getInstance().api.library.artist(id, {
      include: 'albums,playlists'
    });
  },

  async [FETCH_LIBRARY_ALBUMS](
    { dispatch },
    { offset, limit }: SearchParams
  ): Promise<FetchResult<MusicKit.LibraryAlbum>> {
    let albums: MusicKit.LibraryAlbum[] = [];

    try {
      albums = await MusicKit.getInstance().api.library.albums(undefined, {
        offset,
        limit
      });
    } catch (err) {
      // force log out when forbidden
      // await dispatch(LOGOUT);
    }

    const hasNext = albums.length === limit;
    const hasNoData = albums.length === 0 && offset === 0;

    return {
      data: albums,
      hasNext,
      hasNoData
    };
  },

  async [FETCH_LIBRARY_PLAYLISTS](
    { commit, dispatch },
    { offset, limit }: SearchParams
  ): Promise<FetchResult<MusicKit.LibraryPlaylist>> {
    let playlists: MusicKit.LibraryPlaylist[] = [];
    try {
      playlists = await MusicKit.getInstance().api.library.playlists(
        undefined,
        {
          offset,
          limit
        }
      );
    } catch (err) {
      // force log out when forbidden
      // await dispatch(LOGOUT);
      if (err.errorCode === 'ACCESS_DENIED') {
        await dispatch(LOGOUT);
      }
    }

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
    { dispatch },
    { offset, limit }: SearchParams
  ): Promise<FetchResult<MusicKit.LibraryArtist>> {
    let artists: MusicKit.LibraryArtist[] = [];

    try {
      artists = await MusicKit.getInstance().api.library.artists(undefined, {
        offset,
        limit
      });
    } catch (err) {
      // force log out when forbidden
      // await dispatch(LOGOUT);
    }

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
    let songs: MusicKit.LibrarySong[] = [];

    try {
      songs = await MusicKit.getInstance().api.library.songs(undefined, {
        offset,
        limit
      });
      // allSongs.push(...songs);

      // no more songs
      // if (songs.length < limit) {
      //   break;
      // }
      // offset += limit;
    } catch (err) {
      // force log out when forbidden
      // await dispatch(LOGOUT);
    }

    const hasNext = songs.length === limit;
    const hasNoData = songs.length === 0 && offset === 0;

    return {
      data: songs,
      hasNext,
      hasNoData
    };
  },

  [ADD_TO_LIBRARY](_, { itemIds, type }: AddToLibraryPayload) {
    return MusicKit.getInstance().api.addToLibrary({
      [type]: itemIds
    });
  },

  [FETCH_HEAVY_ROTATION](_) {
    return getHeavyRotation();
  },

  [FETCH_RECOMMENDATIONS]() {
    return MusicKit.getInstance().api.recommendations();
  },

  [FETCH_RECENT_PLAYED]() {
    return MusicKit.getInstance().api.recentPlayed({
      offset: 0
    });
  },

  [FETCH_RECENTLY_ADDED]() {
    return getRecentlyAdded();
  },

  [ADD_SONGS_TO_PLAYLIST](
    _,
    { songItems, playlistId }: AddSongsToPlaylistPayload
  ) {
    return addSongsToPlaylist(songItems, playlistId).then(res => {
      if (res.status < 200 || res.status >= 300) {
        throw new Error('Cannot add songs to library');
      }
      return Promise.resolve();
    });
  },

  async [CREATE_NEW_PLAYLIST](
    { commit },
    { name, description, items }: CreateNewPlaylistPayload
  ) {
    const playlist = await createNewPlaylist(name, description, items);

    commit(APPEND_LIBRARY_PLAYLISTS, playlist);
  },

  searchLibrary(_, searchTerm: string) {
    return MusicKit.getInstance().api.library.search(searchTerm, {
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
