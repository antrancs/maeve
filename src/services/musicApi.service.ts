import musicKit from '@/services/musicKit';
import { Collection, CollectionType } from '@/@types/model/model';

enum MediaType {
  artist = 'artists',
  album = 'albums',
  song = 'songs',
  playlist = 'playlists'
}

const MusicApiService = {
  searchAll(
    searchString = ''
  ): Promise<{
    albums: MusicKit.Album[];
    songs: MusicKit.Song[];
    artists: MusicKit.Artist[];
    playlists: MusicKit.Playlist[];
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
    data: MusicKit.Album[];
    hasNext: boolean;
    offset: number;
  } | null> {
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
        const { relationships } = artistRes;
        let albums: MusicKit.Album[] = [];
        let playlists: MusicKit.Playlist[] = [];

        if (relationships) {
          albums = relationships.albums ? relationships.albums.data : [];
          playlists = relationships.playlists
            ? relationships.playlists.data
            : [];
        }
        return {
          name: artistRes.attributes ? artistRes.attributes.name : '',
          albums,
          playlists
        };
      });
  },

  getRecommendations(): Promise<MusicKit.Recommendation[]> {
    return musicKit.getApiInstance().recommendations();
  },

  getLibraryPlaylists() {
    return musicKit.getApiInstance().library.playlists();
  },

  getLibraryAlbums() {
    return musicKit.getApiInstance().library.albums();
  },

  extractCollectionResult(
    result: MusicKit.Album | MusicKit.Playlist
  ): { collection: Collection; tracks: MusicKit.Song[] } | null {
    console.log(result);
    if (!result) {
      return null;
    }

    const tracks = result.relationships
      ? result.relationships.tracks!.data
      : [];

    return {
      collection: result,
      tracks
    };
  },

  getCollection(
    collectionId: string,
    collectionType: CollectionType
  ): Promise<{
    collection: Collection;
    tracks: MusicKit.Song[];
  } | null> {
    if (collectionType === CollectionType.album) {
      return musicKit
        .getApiInstance()
        .album(collectionId, { include: 'tracks' })
        .then(this.extractCollectionResult);
    } else {
      return musicKit
        .getApiInstance()
        .playlist(collectionId, { include: 'tracks, artists' })
        .then(this.extractCollectionResult);
    }
  },

  getLibraryCollection(
    collectionId: string,
    collectionType: string
  ): Promise<{
    collection: Collection;
    tracks: MusicKit.LibrarySong[];
  } | null> {
    console.log(collectionType);
    let promise: Promise<MusicKit.LibraryAlbum | MusicKit.LibraryPlaylist>;
    const api = musicKit.getApiInstance();
    if (collectionType === CollectionType.libraryAlbum) {
      promise = api.library.album(collectionId);
    } else {
      promise = api.library.playlist(collectionId);
    }

    return promise.then(collection => {
      if (!collection) {
        return null;
      }

      let tracks: MusicKit.LibrarySong[] = [];
      if (collection.relationships && collection.relationships.tracks) {
        tracks = collection.relationships.tracks.data;
      }

      return {
        collection,
        tracks
      };
    });
  },

  isResultEmpty(result: object): boolean {
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
