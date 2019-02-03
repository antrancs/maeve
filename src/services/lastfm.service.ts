import axios from 'axios';

function scrobble(track: string, artist: string, token: string) {
  return axios
    .post(
      '/api/lastfm/track/scrobble',
      {
        track,
        artist
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
    .catch(err => {
      console.log('Err scrobbling', err);
    });
}

function getTopArtists(token: string) {
  return axios
    .get('api/lastfm/user/topArtists', {
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
    .get('api/lastfm/user/recentTracks', {
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
      'auth/lastfm/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .catch(err => {
      console.log('Err logging out', err);
    });
}

export { scrobble, logout, getTopArtists, getRecentTracks };
