import axios, { AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.music.apple.com/v1'
});

function getApiHeadersWithUserToken() {
  const musicKitInstance = MusicKit.getInstance();

  return {
    'Music-User-Token': musicKitInstance.musicUserToken,
    Authorization: `Bearer ${musicKitInstance.developerToken}`,
    'Content-Type': 'application/json'
  };
}

function getApiHeaders() {
  return {
    Authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
    'Content-Type': 'application/json'
  };
}

/**
 * Search all catalog resources based on the search term
 * @param searchString The search term
 */
function searchAll(
  searchString = ''
): Promise<{
  albums: MusicKit.Album[];
  songs: MusicKit.Song[];
  artists: MusicKit.Artist[];
  playlists: MusicKit.Playlist[];
} | null> {
  if (!searchString) {
    return Promise.reject();
  }

  return MusicKit.getInstance()
    .api.search(searchString, {
      limit: 11,
      types: 'artists,albums,songs,playlists'
    })
    .then(result => {
      if (isResultEmpty(result)) {
        return null;
      }

      const albums = result.albums
        ? (result.albums.data as MusicKit.Album[])
        : [];
      const playlists = result.playlists
        ? (result.playlists.data as MusicKit.Playlist[])
        : [];
      const artists = result.artists
        ? (result.artists.data as MusicKit.Artist[])
        : [];
      const songs = result.songs ? (result.songs.data as MusicKit.Song[]) : [];

      return {
        albums,
        playlists,
        artists,
        songs
      };
    });
}

/**
 * Get the artist's details and their relationships (albums, playlists)
 * @param artistId id of the artist
 */
function getArtist(artistId: string): Promise<MusicKit.Artist> {
  return MusicKit.getInstance()
    .api.artist(artistId, { include: 'albums,playlists' })
    .then();
}

/**
 * Get all details of one or more activities
 * @param ids Activity ids
 */
function getActivities(ids: string[]): Promise<MusicKit.Activity[]> {
  return MusicKit.getInstance().api.activities(ids);
}

function getCharts(types: string[], limit: number, genre?: string) {
  const params = genre
    ? {
        genre,
        limit
      }
    : {
        limit
      };
  return MusicKit.getInstance().api.charts(types, params);
}

function getCatalogPlaylistTracks(id: string, offset: number) {
  const storefrontId = MusicKit.getInstance().api.storefrontId;
  return axiosInstance
    .get(`catalog/${storefrontId}/playlists/${id}/tracks`, {
      headers: getApiHeaders(),
      params: {
        limit: 100,
        offset
      }
    })
    .then(res => {
      if (!res.data) {
        throw new Error('Error while fetching playlist tracks');
      }

      return res.data;
    });
}

/**
 * Search the catalog for
 * @param term The search term
 * @param types Resource type (possible values are: albums/playlists/artists/songs)
 * @param limit Limit to fetch, max is 25
 * @param offset Search offset
 */
function searchCatalog(
  term: string,
  types: string[],
  limit: number,
  offset: number
): Promise<MusicKit.SearchResult> {
  const storefrontId = MusicKit.getInstance().api.storefrontId;
  return axiosInstance
    .get(`catalog/${storefrontId}/search`, {
      headers: getApiHeaders(),
      params: {
        term,
        limit,
        offset,
        types: types.join(',')
      }
    })
    .then(result => {
      if (result.status === 200) {
        return result.data.results as MusicKit.SearchResult;
      }
      throw new Error('Unable to search for' + term);
    });
}

function getActivityPlaylists(
  activityId: string,
  limit: number,
  offset: number
) {
  const storefrontId = MusicKit.getInstance().api.storefrontId;
  return axiosInstance
    .get(`catalog/${storefrontId}/activities/${activityId}/playlists`, {
      headers: getApiHeaders(),
      params: {
        limit,
        offset
      }
    })
    .then(res => {
      if (!res.data) {
        throw new Error('Error while fetching curators');
      }

      return res.data;
    });
}

function getCuratorRelationship(
  curatorId: string,
  limit: number,
  offset: number
) {
  const storefrontId = MusicKit.getInstance().api.storefrontId;
  return axiosInstance
    .get(`catalog/${storefrontId}/curators/${curatorId}/playlists`, {
      headers: getApiHeaders(),
      params: {
        limit,
        offset
      }
    })
    .then(res => {
      if (!res.data) {
        throw new Error('Error while fetching curators');
      }

      return res.data;
    });
}

function getLibraryPlaylist(id: string) {
  return axiosInstance
    .get(`me/library/playlists/${id}`, {
      headers: getApiHeadersWithUserToken()
    })
    .then(res => {
      if (!res.data) {
        throw new Error('Error while fetching curators');
      }

      return res.data.data ? res.data.data[0] : null;
    });
}

async function getLibraryPlaylistTracks(id: string) {
  const tracks: MusicKit.LibrarySong[] = [];
  let offset = 0;
  for (;;) {
    const { data, next } = await getLibraryPlaylistTracksHelper(
      id,
      100,
      offset
    );
    tracks.push(...data);
    if (!next) {
      break;
    }
    offset += 100;
  }

  return tracks;
}

async function getLibraryPlaylistTracksHelper(
  id: string,
  limit: number,
  offset: number
) {
  const result = await axiosInstance.get(`me/library/playlists/${id}/tracks`, {
    headers: getApiHeadersWithUserToken(),
    params: {
      limit,
      offset
    }
  });

  if (!result.data) {
    throw new Error('Error while fetching curators');
  }

  return result.data;
}

async function getHeavyRotation() {
  const result = await axiosInstance.get('/me/history/heavy-rotation', {
    headers: getApiHeadersWithUserToken(),
    params: {
      limit: 10
    }
  });

  if (!result.data) {
    return [];
  }

  return result.data.data;
}

async function getRecentlyAdded() {
  const result = await axiosInstance.get('me/library/recently-added', {
    headers: getApiHeadersWithUserToken(),
    params: {
      limit: 10
    }
  });

  if (!result.data) {
    return [];
  }

  return result.data.data;
}

function addSongsToPlaylist(
  songItems: { id: string; type: string }[],
  playlistId: string
): Promise<AxiosResponse<any>> {
  return axiosInstance.post(
    `/me/library/playlists/${playlistId}/tracks`,
    {
      data: songItems
    },
    {
      headers: getApiHeadersWithUserToken()
    }
  );
}

async function createNewPlaylist(
  name: string,
  description?: string,
  items?: { id: string; type: string }[]
): Promise<MusicKit.LibraryPlaylist> {
  const attributes = Object.assign(
    {},
    { name },
    description && { description }
  );

  const postData = {
    attributes,
    tracks: items ? items : undefined
  };

  // There's something wrong with the API when passing 'tracks' relationships into the request
  // 'Tracks' gets ignored by the API, so we have to make a separate call to add tracks to the playlist
  const res = await axiosInstance.post(`/me/library/playlists`, postData, {
    headers: getApiHeadersWithUserToken()
  });

  if (res.status !== 201) {
    throw new Error('Cannot create new playlist');
  }

  if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
    throw new Error('Cannot create new playlist');
  }

  const playlist = res.data.data[0];
  if (!items) {
    return playlist;
  }

  await addSongsToPlaylist(items, playlist.id);

  return playlist;
}

/**
 * Get the current user's storefront. Storefront is needed for making API request
 */
async function updateUserStorefront() {
  // By default, we use 'us' storefront to get music previews.
  if (!MusicKit.getInstance().musicUserToken) {
    return;
  }

  const result = await axiosInstance.get('me/storefront', {
    headers: getApiHeadersWithUserToken()
  });

  const storefronts = result.data.data;
  if (!Array.isArray(storefronts) || storefronts.length === 0) {
    return;
  }

  setUserStorefront(storefronts[0].id);
}

function setUserStorefront(storefront: string) {
  const api = MusicKit.getInstance().api;
  api.userStorefrontId = storefront;
  api.storefrontId = storefront;
}
/**
 * Check if the returned result from the API is empty
 * @param result The result object
 */
function isResultEmpty(result: object): boolean {
  return !result || Object.keys(result).length === 0;
}

export {
  searchAll,
  getArtist,
  getActivities,
  getCharts,
  getCatalogPlaylistTracks,
  searchCatalog,
  getActivityPlaylists,
  getCuratorRelationship,
  getLibraryPlaylist,
  getLibraryPlaylistTracks,
  getHeavyRotation,
  getRecentlyAdded,
  addSongsToPlaylist,
  createNewPlaylist,
  updateUserStorefront,
  setUserStorefront
};
