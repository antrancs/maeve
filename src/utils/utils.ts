import axios from 'axios';
import { Collection, Song, Nullable } from '@/@types/model/model';

const getArtworkUrl = (
  originalUrl: string,
  width: number,
  height: number
): string => {
  if (!originalUrl) {
    return '';
  }

  const replace: { [key: string]: number } = {
    '{w}': width,
    '{h}': height
  };

  return originalUrl.replace(/{w}|{h}/gi, matched => {
    return replace[matched].toString();
  });
};

const formatArtworkUrl = (
  artworkUrl: string,
  width: number,
  height: number
) => {
  if (!artworkUrl || artworkUrl.length === 0) {
    return '';
  }
  return `${artworkUrl.substring(
    0,
    artworkUrl.lastIndexOf('/') + 1
  )}${width}x${height}bb.jpg`;
};

/**
 * A workaround to get the artwork for an artist as Apple Music API doesn't support it yet
 * @param {string} itunesUrl - iTunes URL for an artist
 * @param width (optional) - If not provided, the placeholder url will be returned
 * @param height (optional) - If not provided, the placeholder url will be returned
 * @returns {Promise}
 */
const getArtistArtwork = (
  itunesUrl: string,
  artistId: string,
  size: string
): Promise<string> => {
  return axios
    .get('/api/getArtistArtwork-2', {
      params: {
        url: itunesUrl,
        artistId,
        size
      }
    })
    .then(res => {
      return res.data;
    });
};

const getArtistDetails = (url: string, artistId: string, size: string) => {
  return axios
    .get('/api/getArtistDetails', {
      params: {
        url,
        artistId,
        size
      }
    })
    .then(res => {
      return res.data;
    });
};

const getCuratorBanner = (url: string, curatorId: string, size: string) => {
  return axios
    .get('/api/getCuratorBanner', {
      params: {
        url,
        curatorId,
        size
      }
    })
    .then(res => {
      return res.data;
    });
};

const getCuratorsByGenre = (genreId: string) => {
  return axios
    .get('/api/getCuratorsByGenre', {
      params: {
        genreId
      }
    })
    .then(res => {
      return res.data;
    });
};

const getAlbumExtraInfo = (iTunesUrl: string) => {
  return axios
    .get('/api/catalog/albums/extraInfo', {
      params: {
        url: iTunesUrl
      }
    })
    .then(res => {
      return res.data;
    });
};

const getGrammyResults = () => {
  return axios
    .get('/api/grammyResults', {
      params: {
        storefront: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => {
      return res.data;
    });
};

const getSongsFromCollection = (collection: Nullable<Collection>): Song[] => {
  if (
    !collection ||
    !collection.relationships ||
    !collection.relationships.tracks
  ) {
    return [];
  }
  return collection.relationships.tracks.data;
};

const getFeaturedPlaylists = (offset: number, limit: number) => {
  return axios
    .get('/api/featuredPlaylists/all', {
      params: {
        offset,
        limit
      }
    })
    .then(res => {
      return res.data.playlists;
    });
};

const getMainFeaturedPlaylists = () => {
  return axios.get('/api/featuredPlaylists/main').then(res => {
    return res.data.playlists;
  });
};

export {
  getArtworkUrl,
  getArtistArtwork,
  formatArtworkUrl,
  getSongsFromCollection,
  getArtistDetails,
  getCuratorBanner,
  getCuratorsByGenre,
  getAlbumExtraInfo,
  getGrammyResults,
  getFeaturedPlaylists,
  getMainFeaturedPlaylists
};
