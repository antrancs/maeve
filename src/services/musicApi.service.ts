import axios, { AxiosInstance, AxiosResponse } from 'axios';

import musicKit from '@/services/musicKit';
import authService from '@/services/auth.service';
import { Collection, CollectionType, Nullable } from '@/@types/model/model';

class MusicApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.extractCollectionResult = this.extractCollectionResult.bind(this);
    this.axiosInstance = axios.create({
      baseURL: 'https://api.music.apple.com/v1'
    });
  }

  /**
   * Search all catalog resources based on the search term
   * @param searchString The search term
   */
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
        types: 'artists,albums,songs,playlists'
      })
      .then(result => {
        if (this.isResultEmpty(result)) {
          return null;
        }

        const albums = result.albums
          ? (result.albums.data as MusicKit.Album[])
          : [];
        const playlists = result.playlists
          ? (result.playlists.data as MusicKit.Playlist[])
          : [];
        const artists = result.artists
          ? (result.artists.data as MusicKit.Artist[])
          : [];
        const songs = result.songs
          ? (result.songs.data as MusicKit.Song[])
          : [];

        return {
          albums,
          playlists,
          artists,
          songs
        };
      });
  }

  /**
   * Search the catalog for 1 particular resource (album/playlist/song/artist)
   * @param query The search term
   * @param resourceType Resource type
   * @param limit Limit to fetch, max is 25
   * @param offset Search offset
   */
  searchOneResource(
    query: string,
    resourceType: string,
    limit: number,
    offset: number
  ): Promise<{
    data: MusicKit.Resource[];
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
        const resource = result[resourceType]!;
        const hasNext = !!resource.next;

        // We need to extract the offset from the next url for subsequent queries.
        // Manually increasing the offset can lead to duplicates from the returned results
        return {
          data: resource.data || [],
          hasNext,
          offset: hasNext ? this.getOffsetFromNext(resource.next!) : 0
        };
      });
  }

  /**
   * Get the artist's details and their relationships (albums, playlists)
   * @param artistId id of the artist
   */
  getArtist(artistId: string): Promise<MusicKit.Artist> {
    return musicKit
      .getApiInstance()
      .artist(artistId, { include: 'albums,playlists' })
      .then();
  }

  /**
   * Get recommendations for the current user
   */
  getRecommendations(): Promise<MusicKit.Recommendation[]> {
    return musicKit.getApiInstance().recommendations();
  }

  /**
   * Get all songs in the user's library
   */
  getLibrarySongs(ids?: string[]): Promise<MusicKit.LibrarySong[]> {
    return ids
      ? musicKit.getApiInstance().library.songs(ids, {
          include: 'albums,artists'
        })
      : musicKit.getApiInstance().library.songs();
  }

  /**
   * Get a collection (album, playlist) details and its relationships
   * @param collectionId collection id
   * @param collectionType collection type
   */
  getCollection(
    collectionId: string,
    collectionType: CollectionType
  ): Promise<Collection> {
    const api = musicKit.getApiInstance();

    if (collectionType === CollectionType.album) {
      return api.album(collectionId, { include: 'tracks' });
    } else {
      return api.playlist(collectionId, { include: 'tracks, artists' });
    }
  }

  /**
   * Get all details of one or more playlists
   * @param ids Playlist ids
   */
  getPlaylists(ids: string[]): Promise<MusicKit.Playlist[]> {
    return musicKit.getApiInstance().playlists(ids);
  }

  getSongs(ids: string[]): Promise<MusicKit.Song[]> {
    return musicKit.getApiInstance().songs(ids, { include: 'albums, artists' });
  }

  /**
   * Get all details of one or more activities
   * @param ids Activity ids
   */
  getActivities(ids: string[]): Promise<MusicKit.Activity[]> {
    return musicKit.getApiInstance().activities(ids);
  }

  /**
   * Get all details of one activity
   * @param id Id of the activity
   */
  getActivity(id: string): Promise<MusicKit.Activity> {
    return musicKit.getApiInstance().activity(id, {
      include: 'playlists'
    });
  }

  async addSongsToPlaylist(
    songItems: { id: string; type: string }[],
    playlistId: string
  ): Promise<AxiosResponse<any>> {
    return await this.axiosInstance.post(
      `/me/library/playlists/${playlistId}/tracks`,
      {
        data: songItems
      },
      {
        headers: this.apiHeaders
      }
    );
  }

  async createNewPlaylist(
    name: string,
    description?: string,
    items?: { id: string; type: string }[]
  ): Promise<MusicKit.LibraryPlaylist> {
    const attributes = Object.assign(
      {},
      { name },
      description && { description }
    );

    const postData = {
      attributes,
      tracks: items ? items : undefined
    };

    // There's something wrong with the API when passing 'tracks' relationships into the request
    // 'Tracks' gets ignored by the API, so we have to make a separate call to add tracks to the playlist
    const res = await this.axiosInstance.post(
      `/me/library/playlists`,
      postData,
      {
        headers: this.apiHeaders
      }
    );

    if (res.status !== 201) {
      throw new Error('Cannot create new playlist');
    }

    if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
      throw new Error('Cannot create new playlist');
    }

    const playlist = res.data.data[0];
    if (!items) {
      return playlist;
    }

    await this.addSongsToPlaylist(items, playlist.id);

    return playlist;
  }

  /**
   * Get the current user's storefront. Storefront is needed for making API request
   */
  updateUserStorefront() {
    // By default, we use 'us' storefront to get music previews.
    if (!authService.isAuthorized) {
      return;
    }

    return this.axiosInstance
      .get('me/storefront', {
        headers: this.apiHeaders
      })
      .then(result => {
        const storefronts = result.data.data;
        if (!Array.isArray(storefronts) || storefronts.length === 0) {
          return;
        }

        this.setUserStorefront(storefronts[0].id);
      })
      .catch(err => {});
  }

  setUserStorefront(storefront: string) {
    const api = musicKit.getApiInstance();
    api.userStorefrontId = storefront;
    api.storefrontId = storefront;
  }

  private get apiHeaders() {
    return {
      'Music-User-Token': authService.userToken,
      Authorization: `Bearer ${authService.developerToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Check if the returned result from the API is empty
   * @param result The result object
   */
  private isResultEmpty(result: object): boolean {
    return !result || Object.keys(result).length === 0;
  }

  /**
   * Extract the offset info from a 'next' URL returned from a search query
   * @param next The 'next' URL
   * @returns 0 if no match
   */
  private getOffsetFromNext(next: string): number {
    const matches = next.match(/search\?offset=(\d+)/);

    if (!matches || matches.length < 2) {
      return 0;
    }

    // The second item should contain the matched result
    return +matches[1];
  }

  /**
   * Extract the collection's info and its 'tracks' relationships
   * @param result An Album or Playlist instance
   */
  private extractCollectionResult(
    result: MusicKit.Album | MusicKit.Playlist
  ): { collection: Collection; tracks: MusicKit.Song[] } | null {
    if (this.isResultEmpty(result)) {
      return null;
    }

    const tracks = result.relationships
      ? result.relationships.tracks!.data
      : [];

    return {
      collection: result,
      tracks
    };
  }
}

export default new MusicApiService();
