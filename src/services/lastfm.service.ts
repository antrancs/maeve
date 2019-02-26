import axios from 'axios';

function scrobble(
  track: string,
  artist: string,
  token: string,
  album?: string
) {
  return axios
    .post(
      '/lastfm/api/track/scrobble',
      {
        track,
        artist,
        album
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => {
      return res.data;
    })
    .catch(err => err);
}

function getTopArtists(token: string) {
  return axios
    .get('/lastfm/api/user/topArtists', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      return res.data.artist || [];
    });
}

function getRecentTracks(token: string) {
  return axios
    .get('/lastfm/api/user/recentTracks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      return res.data.track || [];
    });
}

function logout(token: string) {
  return axios
    .post(
      'lastfm/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .catch(err => {
      console.log('Err logging out');
    });
}

function blockSong(songId: string, token: string) {
  return axios.post(
    '/lastfm/api/user/blockSong',
    {
      songId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

function unblockSong(songId: string, token: string) {
  return axios.post(
    '/lastfm/api/user/unblockSong',
    {
      songId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

function loadBlockedSongs(token: string) {
  return axios
    .get('/lastfm/api/user/blockedSongs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      return res.data.blockedSongs || [];
    });
}

function loadBlockedArtists(token: string) {
  return axios
    .get('/lastfm/api/user/blockedArtists', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      return res.data.blockedArtists || [];
    });
}

function blockArtists(artistIds: string[], token: string) {
  return axios
    .post(
      '/lastfm/api/user/blockArtists',
      {
        artists: artistIds
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => {
      return res.data;
    });
}

function unblockArtists(artistIds: string[], token: string) {
  return axios
    .post(
      '/lastfm/api/user/unblockArtists',
      {
        artists: artistIds
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => {
      return res.data;
    });
}

export {
  scrobble,
  logout,
  getTopArtists,
  getRecentTracks,
  blockSong,
  unblockSong,
  loadBlockedSongs,
  loadBlockedArtists,
  blockArtists,
  unblockArtists
};
