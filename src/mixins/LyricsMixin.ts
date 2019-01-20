import { Component, Vue } from 'vue-property-decorator';

import { getLyrics } from '@/services/lyrics.service';

@Component
export default class LyricsMixin extends Vue {
  lyrics: string = '';
  loadingLyrics = false;

  $_fetchLyrics(title: string, artistName: string) {
    getLyrics(title, artistName)
      .then(lyrics => {
        this.lyrics = lyrics;
      })
      .catch(err => {
        if (!err.response || err.response.status === 404) {
          this.lyrics = 'Cannot find lyrics for the current song';
        }
      })
      .finally(() => {
        this.loadingLyrics = false;
      });
  }
}
