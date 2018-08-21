import { pick } from 'lodash';
import { load } from 'cheerio';
import { get } from 'axios';

const getArtworkUrl = (originalUrl, width, height) => {
  const replace = {
    '{w}': width,
    '{h}': height
  };

  return originalUrl.replace(/{w}|{h}/gi, matched => replace[matched]);
};

/**
 * Extract the data of the desired content (artists/songs/albums/playlists)
 * from the result object
 * @param {Object} result - The result object returned from MusicKit search API
 * @param {MediaType} field - 1 one the 4 media types
 * @param {Array<String>} wantedAttributes - Properties you want to extract.
 *     Default empty (return ALL properties)
 *  @returns {Array<Object>} - Array of media items (songs/albums/artists/playlists)
 */
const extractSearchData = (result, field, wantedAttributes = []) => {
  if (!result[field] || !result[field].data) {
    return [];
  }

  const items = result[field].data || [];
  return items.map(({ id, attributes, type }) => {
    const properties =
      wantedAttributes.length === 0
        ? attributes
        : pick(attributes, wantedAttributes);

    return {
      id,
      type,
      ...properties
    };
  });
};

const extractArtworkUrl = html => {
  const $ = load(html);
  const artwork = $('meta[property="og:image:secure_url"]').attr('content');
  return artwork;
};

const formatArtworkUrl = (artworkUrl = '') =>
  `${artworkUrl.substring(0, artworkUrl.lastIndexOf('/') + 1)}400x400bb.jpg`;

/**
 * A workaround to get the artwork for an artist as Apple Music API doesn't support it yet
 * @param {String} itunesUrl - iTunes URL for an artist
 *  @returns {Promise}
 */
const getArtistArtwork = itunesUrl =>
  get(itunesUrl)
    .then(result => extractArtworkUrl(result.data))
    .then(formatArtworkUrl);

export { getArtworkUrl, extractSearchData, getArtistArtwork };
