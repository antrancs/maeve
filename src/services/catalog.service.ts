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
    .then(res => {
      return res.data;
    });
}

function getMainFeaturedPlaylists() {
  return axiosInstance
    .get('/playlists/featured/main', {
      params: {
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => {
      return res.data;
    });
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
    .then(res => {
      return res.data;
    });
}

function getFeaturedAlbums() {
  return axiosInstance
    .get('/albums/featuredAlbums', {
      params: {
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => {
      return res.data;
    });
}

function getArtistDetails(url: string, artistId: string, size: string) {
  return axiosInstance
    .get('/artists/details', {
      params: {
        url,
        artistId,
        size
      }
    })
    .then(res => {
      return res.data;
    });
}

function getGenreOneResource(id: string, resource: string) {
  return axiosInstance
    .get(`/genres/${id}/${resource}`, {
      params: {
        country: MusicKit.getInstance().storefrontId
      }
    })
    .then(res => {
      return res.data;
    });
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
    .then(res => {
      return res.data;
    });
}

function getCuratorsByGenre(genreId: string) {
  return axiosInstance.get(`/curators/genre/${genreId}`).then(res => {
    return res.data;
  });
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
  getArtistDetails,
  getAlbumExtraInfo,
  getCuratorBanner,
  getCuratorsByGenre
};
