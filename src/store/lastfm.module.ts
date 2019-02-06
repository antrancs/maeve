import { LastfmState, ScobbleLastfmActionPayload, FetchResult } from './types';
import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { SET_LASTFM_TOKEN } from './mutations.type';
import {
  SCROBBLE_LASTFM,
  SAVE_TOKEN_LASTFM,
  LOAD_TOKEN_LASTFM,
  LOGOUT_LASTFM,
  FETCH_TOP_ARTISTS_LASTFM,
  FETCH_RECENT_TRACKS_LASTFM,
  SEARCH_CATALOG
} from './actions.type';
import {
  scrobble,
  logout,
  getTopArtists,
  getRecentTracks
} from '@/services/lastfm.service';
import { LastfmSong } from '@/@types/model/model';

const MAEVE_LASTFM_TOKEN = 'MAEVE_LASTFM_TOKEN';

const initialState: LastfmState = {
  token: ''
};

const getters: GetterTree<LastfmState, any> = {
  isAuthenticatedLastfm(state): boolean {
    return state.token.length > 0;
  }
};

const actions: ActionTree<LastfmState, any> = {
  [SCROBBLE_LASTFM]({ getters, state }, payload: ScobbleLastfmActionPayload) {
    if (!getters.isAuthenticatedLastfm) {
      return;
    }

    // if isAuthenticatedLastfm is true, the token is certainly not null
    return scrobble(payload.track, payload.artist, state.token!);
  },

  [LOAD_TOKEN_LASTFM]({ commit }) {
    const token = localStorage.getItem(MAEVE_LASTFM_TOKEN);
    commit(SET_LASTFM_TOKEN, token || '');
  },

  [SAVE_TOKEN_LASTFM]({ commit }, token: string) {
    localStorage.setItem(MAEVE_LASTFM_TOKEN, token);
    commit(SET_LASTFM_TOKEN, token);
  },

  async [FETCH_TOP_ARTISTS_LASTFM]({ state, dispatch }) {
    if (!state.token) {
      return;
    }
    const artists = await getTopArtists(state.token);

    // Search for Lastfm artist in Apple Music
    const promises = artists.map((artist: any) => {
      return dispatch(SEARCH_CATALOG, {
        limit: 1,
        offset: 0,
        term: `${artist.name}`,
        type: 'artists'
      });
    }) as Promise<any>[];

    const searchResults = (await Promise.all(promises)) as FetchResult<
      MusicKit.Artist
    >[];

    searchResults.forEach((result, index) => {
      if (!result.data || result.data.length === 0) {
        artists[index].appleMusicId = undefined;
      } else {
        artists[index].appleMusicId = result.data[0].id;
      }
    });

    return artists;
  },

  async [FETCH_RECENT_TRACKS_LASTFM]({ state, dispatch }) {
    if (!state.token) {
      return;
    }
    const tracks = await getRecentTracks(state.token);

    // Search for Lastfm tracks in Apple Music
    const promises = tracks.map((track: any) => {
      return dispatch(SEARCH_CATALOG, {
        limit: 1,
        offset: 0,
        term: `${track.name} ${track.artist['#text']}`,
        type: 'songs'
      });
    }) as Promise<any>[];

    const searchResults = (await Promise.all(promises)) as FetchResult<
      MusicKit.Song
    >[];

    // extract the song item in the searchResults
    let lastfmSongs: LastfmSong[] = [];

    // prevent duplicates
    const songIdsSet = new Set<string>();
    for (let i = 0; i < searchResults.length; i++) {
      const result = searchResults[i];
      if (!result.data || result.data.length === 0) {
        continue;
      }
      const current = result.data[0];

      if (!songIdsSet.has(current.id)) {
        songIdsSet.add(current.id);

        lastfmSongs.push({
          ...result.data[0],
          lastStream: tracks[i].date['#text']
        });
      }
    }

    return lastfmSongs;
  },

  async [LOGOUT_LASTFM]({ dispatch, state }) {
    if (!state.token) {
      return;
    }
    await logout(state.token);

    dispatch(SAVE_TOKEN_LASTFM, '');
  }
};

const mutations: MutationTree<LastfmState> = {
  [SET_LASTFM_TOKEN](state, token: string) {
    state.token = token;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
