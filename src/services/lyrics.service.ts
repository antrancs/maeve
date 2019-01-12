import axios from 'axios';

function getLyrics(songName: string, artistName: string) {
  // just get the song's actual name
  const indexOfParen = songName.indexOf('(');
  const endPos = indexOfParen === -1 ? songName.length : indexOfParen;
  const name = songName.substring(0, endPos);
  return axios
    .get('https://us-central1-maeve-music.cloudfunctions.net/maeve-lyrics', {
      params: {
        songName: name.trim(),
        artistName: artistName.trim()
      }
    })
    .then(res => {
      return res.data;
    });
}

export { getLyrics };
