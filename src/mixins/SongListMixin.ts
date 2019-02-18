import { Component, Vue, Prop } from 'vue-property-decorator';
import { Nullable, Song } from '@/@types/model/model';
import { State, Action } from 'vuex-class';
import { MusicPlayerState, PlaySongsAction } from '@/store/types';
import { PLAY_SONGS } from '@/store/actions.type';

@Component
export default class SongListMixin extends Vue {
  @Prop()
  collectionId: string | undefined;
  @Prop()
  songs!: Song[];
  @Prop({ default: false }) isChart!: boolean;
  @Prop() playlistId: Nullable<string>;
  @Prop({ default: false }) fromAlbum!: boolean;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [PLAY_SONGS]: PlaySongsAction;

  // @Action [FETCH_CATALOG_SONG_DETAILS]: (
  //   ids?: string[]
  // ) => Promise<MusicKit.Song[]>;

  // get tracksFromCollection(): Nullable<Song[]> {
  //   // return null so we'll take the 'songs' prop to render SongList item
  //   if (!this.collection) {
  //     return null;
  //   }

  //   return getSongsFromCollection(this.collection);
  // }

  // get fromAlbum(): boolean {
  //   return (
  //     this.collection !== undefined &&
  //     (this.collection.type === 'albums' ||
  //       this.collection.type === 'library-albums')
  //   );
  // }

  // @Watch('collection')
  // onCollectionChanged(newValue: Collection) {
  //   if (newValue) {
  //     this.$_updateSongItems();
  //   }
  // }

  handlePlaySongs(songId: string) {
    // Since there might be some unavailable songs, we can't rely on their index of the array
    // as the starting index
    let songIndex = 0;
    const songs: Song[] = [];
    for (let i = 0; i < this.songs.length; i++) {
      const current = this.songs[i];
      if (!current.attributes) {
        continue;
      }

      if (current.id === songId) {
        songIndex = songs.length;
      }
      songs.push(current);
    }

    this.playSongs({
      songs,
      songsSourceName: '',
      startSongIndex: songIndex
    });
  }

  handleActionIconClick(song: Song, posX: number, posY: number) {
    // @ts-ignore
    this.$root.$mediaActionMenu.open(song, this.collection, posX, posY, false);
  }

  handleSongClicked(songId: string, songIndex: number) {
    this.handlePlaySongs(songId);
  }

  // async $_updateSongItems() {
  //   // We want to fetch collection songs' 'artists' & 'albums' relationships for linking
  //   if (this.collection) {
  //     let songIds: string[] = [];

  //     switch (this.collection.type) {
  //       case 'albums':
  //       case 'playlists':
  //         // we're sure that collection is NOT null, so tracksFromCollection is not null
  //         songIds = this.tracksFromCollection!.map(song => song.id);
  //         break;

  //       case 'library-albums':
  //       case 'library-playlists':
  //         songIds = this.tracksFromCollection!.map(song => {
  //           return song.attributes!.playParams!.catalogId!;
  //         });
  //         break;
  //       default:
  //         break;
  //     }

  //     const songsWithRelationships = await this.fetchCatalogSongsDetails(
  //       songIds
  //     );

  //     this.songItems = songsWithRelationships;
  //   } else {
  //     // otherwise just use tracksFromCollection or songs
  //     this.songItems = this.tracksFromCollection || this.songs;
  //   }
  // }
}
