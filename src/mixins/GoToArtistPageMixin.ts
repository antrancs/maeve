import { Component, Vue } from 'vue-property-decorator';
import { FETCH_CATALOG_SONG_DETAILS } from '@/store/actions.type';
import { Action } from 'vuex-class';
import { Song } from '@/@types/model/model';

@Component
export default class GoToArtistPageMixin extends Vue {
  @Action [FETCH_CATALOG_SONG_DETAILS]: (
    ids?: string[]
  ) => Promise<MusicKit.Song[]>;

  goToArtistPage(song: Song) {
    let songId: string | undefined;

    switch (song.type) {
      case 'songs':
        songId = song.id;
        break;
      case 'library-songs':
        if (song.attributes && song.attributes.playParams) {
          songId = song.attributes.playParams.catalogId;
        }
    }

    if (!songId) {
      return;
    }

    this.fetchCatalogSongsDetails([songId]).then(songs => {
      const song = songs[0];

      if (song && song.relationships && song.relationships.artists) {
        const mainArtist = song.relationships.artists.data[0];

        this.$router.push({ name: 'artists', params: { id: mainArtist.id } });
      }
    });
  }
}
