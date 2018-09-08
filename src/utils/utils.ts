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

  return originalUrl.replace(/{w}|{h}/gi, matched =>
    replace[matched].toString()
  );
};

const extractArtworkUrl = (html: string) => {
  const $ = load(html);
  const artwork = $('meta[property="og:image:secure_url"]').attr('content');
  return artwork;
};

const formatArtworkUrl = (artworkUrl = '') =>
  `${artworkUrl.substring(0, artworkUrl.lastIndexOf('/') + 1)}400x400bb.jpg`;

/**
 * A workaround to get the artwork for an artist as Apple Music API doesn't support it yet
 * @param {string} itunesUrl - iTunes URL for an artist
 *  @returns {Promise}
 */
const getArtistArtwork = (itunesUrl: string) =>
  axios
    .get(itunesUrl)
    .then(result => extractArtworkUrl(result.data))
    .then(formatArtworkUrl)
    .catch(err => {
      console.log(err);
      return '';
    });

export { getArtworkUrl, getArtistArtwork };
