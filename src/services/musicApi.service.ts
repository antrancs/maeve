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
  search(
    searchString = ''
  ): Promise<{
    albums: MusicKit.AlbumResource[];
    songs: MusicKit.SongResource[];
    artists: MusicKit.ArtistResource[];
    playlists: MusicKit.PlaylistResource[];
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

  getArtist(artistId: string) {
    return musicKit
      .getApiInstance()
      .artist(artistId, { include: 'albums,playlists' })
      .then(artistRes => {
        console.log(artistRes);
        // relationships should be there when specifing 'include' in the search parameter
        const relationships = artistRes.relationships!;
        return {
          name: artistRes.attributes ? artistRes.attributes.name : '',
          albums: relationships.albums ? relationships.albums.data : [],
          playlists: relationships.playlists ? relationships.playlists.data : []
        };
      });
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
    console.log(collectionId, collectionType);
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
  }
};

export { CollectionType };
export default MusicApiService;
