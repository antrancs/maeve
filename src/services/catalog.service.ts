import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/catalog'
});

function getGenresForCountry() {
  return axiosInstance
    .get('/genres', {
      params: {
        cc: MusicKit.getInstance().storefrontId
      }
    })
    .then(result => result.data);
}

function getOneGenreForCountry(genreId: string, limit: number) {
  return axiosInstance
    .get(`/genres/${genreId}`, {
      params: {
        limit,
        cc: MusicKit.getInstance().storefrontId
      }
    })
    .then(result => result.data);
}

function getAllBrowseCategories() {
  return axiosInstance.get('/browse').then(result => result.data);
}

function getOneBrowseCategory(id: string) {
  return axiosInstance.get(`/browse/${id}`).then(result => result.data);
}

function getFeaturedPlaylists() {
  return axiosInstance
    .get('/playlists/featured/all', {
      params: {
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => res.data);
}

function getMainFeaturedPlaylists(limit: number) {
  return axiosInstance
    .get('/playlists/featured/main', {
      params: {
        country: MusicKit.getInstance().storefrontId,
        limit
      }
    })
    .then(res => res.data);
}

function getFeaturedAlbums() {
  return axiosInstance
    .get('/albums/featuredAlbums', {
      params: {
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => res.data);
}

function getGenreOneResource(id: string, resource: string) {
  return axiosInstance
    .get(`/genres/${id}/${resource}`, {
      params: {
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => res.data);
}

function getNewReleases(genre: string, limit: number) {
  return axiosInstance
    .get('/newReleases/', {
      params: {
        country: MusicKit.getInstance().storefrontId,
        genre,
        limit
      }
    })
    .then(res => res.data);
}

function getNewReleasesGenres() {
  return axiosInstance
    .get('/newReleases/genres', {
      params: {
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => res.data);
}

function getArtistArtwork(
  itunesUrl: string,
  artistId: string,
  size: string
): Promise<string> {
  return axiosInstance
    .get('/artists/artwork', {
      params: {
        url: itunesUrl,
        artistId,
        size
      }
    })
    .then(res => res.data);
}

function getArtistResources(url: string, artistId: string, size: string) {
  return axiosInstance
    .get('/artists/resources', {
      params: {
        url,
        artistId,
        size
      }
    })
    .then(res => res.data);
}

function getArtistOneResource(artistId: String, s: number) {
  return axiosInstance
    .get('/artists/resource', {
      params: {
        id: artistId,
        cc: MusicKit.getInstance().storefrontId,
        s
      }
    })
    .then(res => res.data);
}

function getAlbumExtraInfo(iTunesUrl: string) {
  return axiosInstance
    .get('/albums/extraInfo', {
      params: {
        url: iTunesUrl
      }
    })
    .then(res => {
      return res.data;
    });
}

function getCuratorBanner(url: string, curatorId: string, size: string) {
  return axiosInstance
    .get('/curators/banner', {
      params: {
        url,
        curatorId,
        size
      }
    })
    .then(res => res.data);
}

function getCuratorsByGenre(genreId: string) {
  return axiosInstance.get(`/curators/genre/${genreId}`).then(res => res.data);
}

export {
  getGenresForCountry,
  getAllBrowseCategories,
  getOneBrowseCategory,
  getOneGenreForCountry,
  getGenreOneResource,
  getFeaturedPlaylists,
  getMainFeaturedPlaylists,
  getArtistArtwork,
  getFeaturedAlbums,
  getArtistResources,
  getAlbumExtraInfo,
  getCuratorBanner,
  getCuratorsByGenre,
  getNewReleases,
  getNewReleasesGenres,
  getArtistOneResource
};
