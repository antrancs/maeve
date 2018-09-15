import { pick } from 'lodash';
import musicKit from '@/services/musicKit';
import { Collection } from '@/@types/model/model';

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

const MusicApiService = {
  searchAll(
    searchString = ''
  ): Promise<{
    albums: MusicKit.AlbumResource[];
    songs: MusicKit.SongResource[];
    artists: MusicKit.ArtistResource[];
    playlists: MusicKit.PlaylistResource[];
  } | null> {
    if (!searchString) {
      return Promise.reject();
    }

    return musicKit
      .getApiInstance()
      .search(searchString, {
        limit: 11,
        types: Object.values(MediaType).join(',')
      })
      .then(result => {
        if (this.isResultEmpty(result)) {
          return null;
        }

        console.log(result);
        const albums = result.albums ? result.albums.data : [];
        const playlists = result.playlists ? result.playlists.data : [];
        const artists = result.artists ? result.artists.data : [];
        const songs = result.songs ? result.songs.data : [];

        return {
          albums,
          playlists,
          artists,
          songs
        };
      });
  },

  searchOneResource(
    query: string,
    resourceType: string,
    limit: number,
    offset: number
  ): Promise<{
    data: MusicKit.AlbumResource[];
    hasNext: boolean;
    offset: number;
  } | null> {
    this.getRecommendations();
    return musicKit
      .getApiInstance()
      .search(query, {
        limit,
        types: resourceType,
        offset
      })
      .then(result => {
        if (this.isResultEmpty(result) || !result[resourceType]) {
          return null;
        }
        const resource = result[resourceType];
        const hasNext = !!resource.next;
        return {
          data: resource.data,
          hasNext,
          offset: hasNext ? this.getOffsetFromNext(result.albums!.next!) : 0
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
          name: artistRes.attributes ? artistRes.attributes.name : '',
          albums: relationships.albums ? relationships.albums.data : [],
          playlists: relationships.playlists ? relationships.playlists.data : []
        };
      });
  },

  getRecommendations() {
    return musicKit.getApiInstance().recommendations();
  },

  extractCollectionResult(
    result: MusicKit.AlbumResource | MusicKit.PlaylistResource
  ): { collection: Collection; tracks: MusicKit.SongResource[] } | null {
    if (!result) {
      return null;
    }

    const { attributes, id, type } = result;
    let tracks = result.relationships ? result.relationships.tracks!.data : [];

    return {
      collection: {
        attributes,
        id,
        type: <CollectionType>type
      },
      tracks
    };
  },

  getCollection(
    collectionId: string,
    collectionType: CollectionType
  ): Promise<{
    collection: Collection;
    tracks: MusicKit.SongResource[];
  } | null> {
    if (collectionType === CollectionType.album) {
      return musicKit
        .getApiInstance()
        .album(collectionId, { include: 'tracks' })
        .then(this.extractCollectionResult);
    } else {
      return musicKit
        .getApiInstance()
        .playlist(collectionId, { include: 'tracks' })
        .then(this.extractCollectionResult);
    }
  },

  isResultEmpty(result: object) {
    return Object.keys(result).length === 0;
  },

  getOffsetFromNext(next: string): number {
    const matches = next.match(/search\?offset=(\d+)/);

    if (!matches || matches.length < 2) {
      return 0;
    }
    return +matches[1];
  }
};

export { CollectionType };
export default MusicApiService;
