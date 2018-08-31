import { pick } from 'lodash';
import musicKit from './musicKit';

const MediaType = {
  artists: 'artists',
  albums: 'albums',
  songs: 'songs',
  playlists: 'playlists'
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

const albumFields = [
  'artistName',
  'artwork',
  'contentRating',
  'editorialNotes',
  'name',
  'playParams',
  'releaseDate',
  'trackCount'
];

const songFields = [
  'albumName',
  'artistName',
  'artwork',
  'contentRating',
  'durationInMillis',
  'name',
  'releaseDate',
  'trackNumber'
];

const playlistFields = [
  'artwork',
  'description',
  'curatorName',
  'name',
  'playParams'
];

const MusicApiService = {
  search(searchString = '') {
    if (!searchString) {
      return Promise.reject();
    }

    return musicKit
      .getApiInstance()
      .search(searchString, {
        limit: 10,
        types: Object.values(MediaType).join(',')
      })
      .then(result => {
        if (Object.keys(result).length === 0) {
          return {};
        }

        const albums = extractSearchData(result, MediaType.albums, albumFields);
        const songs = extractSearchData(result, MediaType.songs, songFields);

        const artists = extractSearchData(result, MediaType.artists, [
          'name',
          'url'
        ]);

        const playlists = extractSearchData(
          result,
          MediaType.playlists,
          playlistFields
        );

        return {
          albums,
          playlists,
          artists,
          songs
        };
      });
  },

  getArtist(artistId) {
    return musicKit
      .getApiInstance()
      .artist(artistId, { include: 'albums,playlists' })
      .then(artistRes => ({
        name: artistRes.attributes.name,
        albums: extractSearchData(
          artistRes.relationships,
          MediaType.albums,
          albumFields
        ),
        playlists: extractSearchData(
          artistRes.relationships,
          MediaType.playlists,
          playlistFields
        )
      }));
  },

  getAlbum(albumId) {
    return musicKit
      .getApiInstance()
      .album(albumId, { include: 'tracks' })
      .then(result => {
        const album = pick(result.attributes, albumFields);
        console.log(result.relationships.tracks);
        const tracks = extractSearchData(
          result.relationships,
          'tracks',
          songFields
        );

        return { album, tracks };
      });
  }
};

export default MusicApiService;
