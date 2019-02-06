import { Component, Vue } from 'vue-property-decorator';
import { Collection, Nullable } from '@/@types/model/model';
import { getSongsFromCollection } from '@/utils/utils';
import { Action } from 'vuex-class';
import { FETCH_CATALOG_SONG_DETAILS } from '@/store/actions.type';

@Component
export default class CollectionSongsMixin extends Vue {
  songs: MusicKit.Song[] = [];

  @Action [FETCH_CATALOG_SONG_DETAILS]: (
    ids?: string[]
  ) => Promise<MusicKit.Song[]>;

  async getSongsDetail(collection: Nullable<Collection>) {
    this.songs = [];
    if (!collection) {
      this.songs = [];
      return;
    }

    let songIds: string[] = [];

    let songs = getSongsFromCollection(collection);
    switch (collection.type) {
      case 'albums':
      case 'playlists':
        // we're sure that collection is NOT null, so tracksFromCollection is not null
        songIds = songs.map(song => song.id);
        break;

      case 'library-albums':
      case 'library-playlists':
        songIds = songs.map(song => {
          if (!song.attributes!.playParams) {
            return song.id;
          }
          return song.attributes!.playParams!.catalogId!;
        });
        break;
      default:
        break;
    }

    const songsWithRelationships = await this.fetchCatalogSongsDetails(songIds);

    this.songs = songsWithRelationships;
  }
}
