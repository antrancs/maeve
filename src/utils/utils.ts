import axios from 'axios';
import { Collection, Song } from '@/@types/model/model';

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
  width?: number,
  height?: number
): Promise<string> => {
  return axios
    .get(
      'https://us-central1-maeve-music.cloudfunctions.net/getArtistArtwork',
      {
        params: {
          url: itunesUrl,
          width,
          height
        }
      }
    )
    .then(res => {
      return res.data;
    });
};

const getSongsFromCollection = (collection: Collection): Song[] => {
  if (!collection.relationships || !collection.relationships.tracks) {
    return [];
  }
  return collection.relationships.tracks.data;
};

export {
  getArtworkUrl,
  getArtistArtwork,
  formatArtworkUrl,
  getSongsFromCollection
};
