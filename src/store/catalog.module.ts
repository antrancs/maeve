import { ActionTree, MutationTree, GetterTree } from 'vuex';

import musicKit from '@/services/musicKit';
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
  FETCH_CATALOG_SONG_DETAILS
} from './actions.type';
import {
  CatalogState,
  SearchCatalogPayload,
  FetchResult,
  FetchCuratorPlaylistsPayload
} from './types';
import musicApiService from '@/services/musicApi.service';

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

  [FETCH_MULTIPLE_ARTISTS_CATALOG](_, ids: string[]) {
    return musicKit.getApiInstance().artists(ids);
  },

  [FETCH_ONE_RECOMMENDATION](_, id: string) {
    return musicKit.getApiInstance().recommendation(id);
  },

  [FETCH_ONE_CURATOR](_, id: string) {
    return musicKit.getApiInstance().curator(id);
  },

  async [FETCH_CURATOR_PLAYLISTS](
    _,
    { id, limit, offset }: FetchCuratorPlaylistsPayload
  ): Promise<FetchResult<MusicKit.Playlist>> {
    const result = await musicApiService.getCuratorRelationship(
      id,
      limit,
      offset
    );

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
    return musicKit.getApiInstance().curators(ids);
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
      const searchResult = await musicApiService.searchCatalog(
        term,
        [type],
        limit,
        offset
      );
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
    return await musicKit.getApiInstance().songs(ids || []);
  }
};

const mutations: MutationTree<CatalogState> = {};

export default {
  state: initialState,
  actions,
  mutations
};
