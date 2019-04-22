import axios from 'axios';
import random from 'lodash/random';

import { Collection, Song, Nullable } from '@/@types/model/model';
import { isLight, TEXT_PRIMARY_DARK, TEXT_PRIMARY_LIGHT } from '@/themes';

const bgColors = [
  ['#556270', '#4ECDC4'],
  ['#114357', '#F29492'],
  ['#525252', '#3d72b4'],
  ['#514A9D', '#24C6DC']
]; // used when the artwork doesn't have bgColor properties

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

const getArtworkSize = (screenSize: string) => {
  switch (screenSize) {
    case 'xl':
      return 300;
    case 'lg':
      return 270;
    case 'md':
      return 240;
    case 'sm':
      return 210;
    default:
      return 180;
  }
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
    .get('/api/catalog/artists/artwork', {
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
    .get('/api/catalog/artists/details', {
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
    .get('/api/catalog/curators/banner', {
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
  return axios.get(`/api/catalog/curators/genre/${genreId}`).then(res => {
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

const getFeaturedAlbums = () => {
  return axios
    .get('/api/catalog/albums/featuredAlbums', {
      params: {
        country: MusicKit.getInstance().storefrontId
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

const getFeaturedPlaylists = () => {
  return axios
    .get('/api/catalog/playlists/featured/all', {
      params: {
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => {
      return res.data;
    });
};

const getMainFeaturedPlaylists = () => {
  return axios
    .get('/api/catalog/playlists/featured/main', {
      params: {
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => {
      return res.data;
    });
};

const getGenreData = (id: string, limit: number) => {
  return axios
    .get(`/api/catalog/genres/${id}`, {
      params: {
        limit,
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => {
      return res.data;
    });
};

const getGenreOneResource = (id: string, resource: string) => {
  return axios
    .get(`/api/catalog/genres/${id}/${resource}`, {
      params: {
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => {
      return res.data;
    });
};

const getBrowsePlaylists = (path: string) => {
  return axios.get(`/api/catalog/browse/${path}`).then(res => {
    return res.data;
  });
};

const hexToRgb = (hex: string) => {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b];
};

const getTextColorForBackground = (bgColor: string) => {
  return isLight(bgColor) ? TEXT_PRIMARY_LIGHT : TEXT_PRIMARY_DARK;
};

// return 2 colors for gradient background color based on the given artwork
const getGradientBackgroundColorsFromArtwork = (artwork: MusicKit.Artwork) => {
  const { bgColor, textColor1, textColor2, textColor3, textColor4 } = artwork;

  if (!bgColor) {
    const bgColorIndex = random(0, bgColors.length - 1);

    return bgColors[bgColorIndex];
  }
  if (isLight(bgColor)) {
    const firstColor = textColor1 || '000000';
    const secondColor = textColor3 || textColor2 || '000000';

    return [`#${firstColor}`, `#${secondColor}`];
  }

  const secondColor = textColor2 || textColor1 || '000000';
  return [`#${bgColor}`, `#${secondColor}`];
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
  getMainFeaturedPlaylists,
  getArtworkSize,
  getGenreData,
  getGenreOneResource,
  getBrowsePlaylists,
  hexToRgb,
  getTextColorForBackground,
  getFeaturedAlbums,
  getGradientBackgroundColorsFromArtwork
};
