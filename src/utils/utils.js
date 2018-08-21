import { pick } from 'lodash';

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

export { getArtworkUrl, extractSearchData };
