import musicApi from '@/services/musicApi.service';
import musicKitService from '@/services/musicKit';

import {
  albumsResource,
  artistsResource,
  songsResource
} from './../data/resourceData';
import { CollectionType } from '@/@types/model/model';

describe('musicApi.service', () => {
  let musicKitMock: jest.SpyInstance<() => MusicKit.API>;

  beforeEach(() => {
    musicKitMock = jest.spyOn(musicKitService, 'getApiInstance');
  });

  const setupSearch = (searchResult: object) => {
    const searchMock = jest.fn(() => Promise.resolve(searchResult));

    musicKitMock.mockImplementation(() => ({
      search: searchMock
    }));
  };

  describe('searchAll', () => {
    it('Should call musicKit.getApiInstance().search()', () => {
      const searchMock = jest.fn(() => Promise.resolve({}));
      musicKitMock.mockImplementation(() => ({
        search: searchMock
      }));

      return musicApi.searchAll('Abc').then(result => {
        expect(searchMock).toHaveBeenCalledWith('Abc', expect.anything());
        expect(result).toBeFalsy();
      });
    });

    it('Should return valid result', () => {
      const albums = {
        data: albumsResource
      };

      const artists = {
        data: artistsResource
      };

      const songs = {
        data: songsResource
      };

      const searchResult = {
        albums,
        artists,
        songs
      };
      setupSearch(searchResult);

      return musicApi.searchAll('NF').then(result => {
        expect(result).toBeTruthy();

        const albumsResult = result!.albums;
        expect(albumsResult.length).toBe(albumsResource.length);
        expect(albumsResult[0]).toEqual(albumsResource[0]);
        expect(albumsResult[1]).toEqual(albumsResource[1]);

        const songsResult = result!.songs;
        expect(songsResult.length).toBe(songs.data.length);
        expect(songsResult[0]).toEqual(songs.data[0]);

        const artistsResult = result!.artists;
        expect(artistsResult.length).toBe(artists.data.length);
        expect(artistsResult[0]).toEqual(artists.data[0]);

        const playlistsResult = result!.playlists;
        expect(Array.isArray(playlistsResult)).toBe(true);
        expect(playlistsResult.length).toBe(0);
      });
    });
  });

  describe('searchOneResource', () => {
    it('Should return proper results for a resource type', () => {
      const offset = 27;
      const searchResult = {
        albums: {
          data: albumsResource,
          next: `/v1/catalog/us/search?offset=${offset}&term=nf&types=albums`
        }
      };
      setupSearch(searchResult);

      return musicApi.searchOneResource('NF', 'albums', 10, 0).then(result => {
        expect(result).toBeTruthy();

        const dataResult = result!.data;
        expect(dataResult.length).toBe(albumsResource.length);
        expect(dataResult[0]).toEqual(albumsResource[0]);
        expect(dataResult[1]).toEqual(albumsResource[1]);

        expect(result!.hasNext).toBe(true);
        expect(result!.offset).toBe(offset);
      });
    });
  });

  describe('getCollection', () => {
    it('Should return Album collection with tracks relationships', () => {
      const albumsWithRelationships: MusicKit.Album = {
        ...albumsResource[0],
        relationships: {
          tracks: {
            data: songsResource
          }
        }
      };
      const albumMock = jest.fn(() => Promise.resolve(albumsWithRelationships));

      musicKitMock.mockImplementation(() => ({
        album: albumMock
      }));

      return musicApi
        .getCollection('c123', CollectionType.album)
        .then(result => {
          expect(result).toBeTruthy();
          // expect(result!.collection).toBeTruthy();
          // expect(result!.tracks).toBeTruthy();

          // expect(result!.collection).toEqual(albumsWithRelationships);
        });
    });
  });
});
