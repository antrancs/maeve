import { Component, Vue } from 'vue-property-decorator';
import { FETCH_CATALOG_SONG_DETAILS } from '@/store/actions.type';
import { Action } from 'vuex-class';
import { Song } from '@/@types/model/model';

@Component
export default class GoToAlbumPageMixin extends Vue {
  @Action [FETCH_CATALOG_SONG_DETAILS]: (
    ids?: string[]
  ) => Promise<MusicKit.Song[]>;

  goToAlbumPage(item: Song | MusicKit.MediaItem) {
    let songId: string | undefined;

    switch (item.type) {
      case 'library-songs':
        if (item.attributes && item.attributes.playParams) {
          songId = item.attributes.playParams.catalogId;
        }
        break;
      default:
        songId = item.id;
    }

    if (!songId) {
      return;
    }

    this.fetchCatalogSongsDetails([songId]).then(songs => {
      const song = songs[0];

      if (song && song.relationships && song.relationships.albums) {
        const album = song.relationships.albums.data[0];

        this.$router.push({ name: 'albums', params: { id: album.id } });
      }
    });
  }
}
