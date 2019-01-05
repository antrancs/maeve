import { load } from 'cheerio';
import axios from 'axios';

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

const extractArtworkUrl = (html: string) => {
  const $ = load(html);
  const artwork = $('meta[property="og:image:secure_url"]').attr('content');

  return artwork;
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
    .get(itunesUrl)
    .then(result => extractArtworkUrl(result.data))
    .then(url => {
      if (!width || !height) {
        return url;
      }
      return formatArtworkUrl(url, width, height);
    })
    .catch(err => {
      return '';
    });
};

export { getArtworkUrl, getArtistArtwork, formatArtworkUrl };
