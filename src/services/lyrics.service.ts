import axios from 'axios';

function getLyrics(songName: string, artistName: string) {
  return axios
    .get('/api/maeve-lyrics', {
      params: {
        songName: songName.trim(),
        artistName: artistName.trim()
      }
    })
    .then(res => {
      return res.data;
    });
}

export { getLyrics };
