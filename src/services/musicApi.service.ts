import { pick } from 'lodash';
import musicKit from '@/services/musicKit';

enum MediaType {
  artist = 'artists',
  album = 'albums',
  song = 'songs',
  playlist = 'playlists'
}

enum CollectionType {
  playlist = 'playlists',
  album = 'albums'
}

/**
 * Extract the data of the desired content (artists/songs/albums/playlists)
 * from the result object
 * @param {Object} result - The result object returned from MusicKit search API
 * @param {MediaType} field - 1 one the 4 media types
 * @param {Array<String>} wantedAtrributes - Properties you want to extract.
 *     Default empty (return ALL properties)
 *  @returns {Array<Object>} - Array of media items (songs/albums/artists/playlists)
 */
const extractSearchData = (
  resourceData: MusicKit.ResourceData,
  wantedAttributes: string[] = []
): any[] => {
  // if (!result[field] || !result[field].data) {
  //   return [];
  // }

  const items = resourceData.data || [];
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
  search(
    searchString = ''
  ): Promise<{
    albums: any[];
    songs: any[];
    artists: any[];
    playlists: any[];
  }> {
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
          return { albums: [], playlists: [], artists: [], songs: [] };
        }

        const albums = extractSearchData(result.albums!, albumFields);
        const songs = extractSearchData(result.songs!, songFields);

        const artists = extractSearchData(result.artists!, ['name', 'url']);

        const playlists = extractSearchData(result.playlists!, playlistFields);

        return {
          albums,
          playlists,
          artists,
          songs
        };
      });
  },

  getArtist(artistId: string) {
    return musicKit
      .getApiInstance()
      .artist(artistId, { include: 'albums,playlists' })
      .then(artistRes => {
        // relationships should be there when specifing 'include' in the search parameter
        const relationships = artistRes.relationships!;
        return {
          name: artistRes.attributes.name,
          albums: extractSearchData(relationships.albums!, albumFields),
          playlists: extractSearchData(relationships.playlists!, playlistFields)
        };
      });
  },

  getCollection(collectionId: string, collectionType: CollectionType) {
    let getCollectionPromise;
    let collectionFields: string[] = [];
    if (collectionType === CollectionType.album) {
      getCollectionPromise = musicKit
        .getApiInstance()
        .album(collectionId, { include: 'tracks' });

      collectionFields = albumFields;
    } else {
      getCollectionPromise = musicKit
        .getApiInstance()
        .playlist(collectionId, { include: 'tracks' });

      collectionFields = playlistFields;
    }

    return getCollectionPromise.then(result => {
      const collection = pick(result.attributes, collectionFields);
      let tracks: any[] = [];
      if (result.relationships && result.relationships.tracks) {
        tracks = extractSearchData(result.relationships.tracks, songFields);
      }

      return { collection, tracks };
    });
  }
};

export { CollectionType };
export default MusicApiService;
