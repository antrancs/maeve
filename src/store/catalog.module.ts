import { ActionTree, MutationTree, GetterTree } from 'vuex';

import {
  FETCH_ONE_ALBUM_CATALOG,
  FETCH_ONE_PLAYLIST_CATALOG,
  FETCH_MULTIPLE_PLAYLISTS_CATALOG,
  FETCH_ONE_RECOMMENDATION,
  SEARCH_CATALOG,
  FETCH_MULTIPLE_ARTISTS_CATALOG,
  FETCH_ONE_CURATOR,
  FETCH_MULTIPLE_CURATORS,
  FETCH_CURATOR_PLAYLISTS,
  FETCH_CATALOG_SONG_DETAILS,
  FETCH_MULTIPLE_SONGS_CATALOG,
  FETCH_ONE_SONG_CATALOG,
  FETCH_ALBUM_EXTRA_INFO_CATALOG,
  FETCH_MULTILE_ALBUMS_CATALOG,
  FETCH_ONE_ACTIVITY_CATALOG,
  FETCH_ACTIVITY_PLAYLISTS
} from './actions.type';
import {
  CatalogState,
  SearchCatalogPayload,
  FetchResult,
  FetchCuratorPlaylistsPayload,
  FetchActivityPlaylistsPayload
} from './types';
import { getAlbumExtraInfo } from '@/services/catalog.service';
import {
  getCatalogPlaylistTracks,
  searchCatalog,
  getActivityPlaylists,
  getCuratorRelationship
} from '@/services/musicApi.service';

const initialState: CatalogState = {};

/**
 * Extract the offset info from a 'next' URL returned from a search query
 * @param next The 'next' URL
 * @returns 0 if no match
 */
function getOffsetFromNext(next: string): number {
  const matches = next.match(/search\?offset=(\d+)/);

  if (!matches || matches.length < 2) {
    return 0;
  }

  // The second item should contain the matched result
  return +matches[1];
}

const actions: ActionTree<CatalogState, any> = {
  async [FETCH_ONE_ALBUM_CATALOG](_, id: string) {
    return await MusicKit.getInstance().api.album(id, { include: 'tracks' });
  },

  async [FETCH_ONE_PLAYLIST_CATALOG](_, id: string) {
    // by default, the call already includes 'tracks' and 'curator' relationships
    const playlist = await MusicKit.getInstance().api.playlist(id);

    // if there's 'next' property, there are more than 100 songs in the playlists --> fetch the remaining songs
    if (
      playlist.relationships &&
      playlist.relationships.tracks &&
      playlist.relationships.tracks.next
    ) {
      const remainingSongs = [];
      let offset = 100;
      for (;;) {
        const { data, next } = await getCatalogPlaylistTracks(id, offset);

        remainingSongs.push(...data);
        if (!next) {
          break;
        }

        offset += 100;
      }

      playlist.relationships.tracks.data.push(...remainingSongs);
    }

    return playlist;
  },

  [FETCH_MULTIPLE_PLAYLISTS_CATALOG](_, ids: string[]) {
    return MusicKit.getInstance().api.playlists(ids);
  },

  [FETCH_MULTILE_ALBUMS_CATALOG](_, ids: string[]) {
    return MusicKit.getInstance().api.albums(ids);
  },

  [FETCH_MULTIPLE_SONGS_CATALOG](_, ids: string[]) {
    return MusicKit.getInstance().api.songs(ids);
  },

  [FETCH_ONE_SONG_CATALOG](_, id: string) {
    return MusicKit.getInstance().api.song(id);
  },

  [FETCH_MULTIPLE_ARTISTS_CATALOG](_, ids: string[]) {
    return MusicKit.getInstance().api.artists(ids);
  },

  [FETCH_ONE_RECOMMENDATION](_, id: string) {
    return MusicKit.getInstance().api.recommendation(id);
  },

  [FETCH_ONE_CURATOR](_, id: string) {
    return MusicKit.getInstance().api.curator(id);
  },

  async [FETCH_CURATOR_PLAYLISTS](
    _,
    { id, limit, offset }: FetchCuratorPlaylistsPayload
  ): Promise<FetchResult<MusicKit.Playlist>> {
    const result = await getCuratorRelationship(id, limit, offset);

    const data = result.data;
    const hasNext = data.length === limit;
    const hasNoData = data.length === 0 && offset === 0;

    return {
      data: result.data,
      hasNext,
      hasNoData
    };
  },

  [FETCH_MULTIPLE_CURATORS](_, ids: string[]) {
    return MusicKit.getInstance().api.curators(ids);
  },

  async [SEARCH_CATALOG](
    _,
    { offset, limit, term, type }: SearchCatalogPayload
  ): Promise<
    FetchResult<
      MusicKit.Album | MusicKit.Playlist | MusicKit.Song | MusicKit.Artist
    >
  > {
    try {
      const searchResult = await searchCatalog(term, [type], limit, offset);
      const items = searchResult[type] ? searchResult[type]!.data : [];

      const hasNext = items.length === limit;
      const hasNoData = items.length === 0 && offset === 0;

      const nextOffset = getOffsetFromNext(searchResult[type]!.next || '');
      return {
        data: items,
        hasNext,
        hasNoData,
        offset: nextOffset
      };
    } catch {
      return {
        data: [],
        hasNext: false,
        hasNoData: true
      };
    }
  },

  async [FETCH_CATALOG_SONG_DETAILS](_, ids?: string[]) {
    return await MusicKit.getInstance().api.songs(ids || []);
  },

  [FETCH_ALBUM_EXTRA_INFO_CATALOG](_, url: string) {
    return getAlbumExtraInfo(url);
  },

  [FETCH_ONE_ACTIVITY_CATALOG](_, id: string): Promise<MusicKit.Activity> {
    return MusicKit.getInstance().api.activity(id, {
      include: 'playlists'
    });
  },

  async [FETCH_ACTIVITY_PLAYLISTS](
    _,
    { id, limit, offset }: FetchActivityPlaylistsPayload
  ) {
    const result = await getActivityPlaylists(id, limit, offset);

    const data = result.data;
    const hasNext = data.length === limit;
    const hasNoData = data.length === 0 && offset === 0;

    return {
      data: result.data,
      hasNext,
      hasNoData
    };
  }
};

const mutations: MutationTree<CatalogState> = {};

export default {
  state: initialState,
  actions,
  mutations
};
