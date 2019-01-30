import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Collection, Nullable, Song } from '@/@types/model/model';
import { State, Action } from 'vuex-class';
import { MusicPlayerState, PlaySongsAction } from '@/store/types';
import { PLAY_SONGS, FETCH_CATALOG_SONG_DETAILS } from '@/store/actions.type';
import { getSongsFromCollection } from '@/utils/utils';

@Component
export default class SongListMixin extends Vue {
  // songItems will be used to render SongList item
  songItems: Song[] = [];

  // SongList components can take in either a collection or a list of songs
  // If a collection is passed, we'll derive the tracks from that collection
  @Prop()
  collection!: Collection | undefined;
  @Prop()
  songs!: Song[];
  @Prop({ default: false }) isChart!: boolean;
  @Prop() playlistId: Nullable<string>;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [PLAY_SONGS]: PlaySongsAction;

  @Action [FETCH_CATALOG_SONG_DETAILS]: (
    ids?: string[]
  ) => Promise<MusicKit.Song[]>;

  get tracksFromCollection(): Nullable<Song[]> {
    // return null so we'll take the 'songs' prop to render SongList item
    if (!this.collection) {
      return null;
    }

    return getSongsFromCollection(this.collection);
  }

  get fromAlbum(): boolean {
    return (
      this.collection !== undefined &&
      (this.collection.type === 'albums' ||
        this.collection.type === 'library-albums')
    );
  }

  @Watch('collection')
  onCollectionChanged(newValue: Collection) {
    if (newValue) {
      this.$_updateSongItems();
    }
  }

  created() {
    this.$_updateSongItems();
  }

  handlePlaySongs(songId: string) {
    // Since there might be some unavailable songs, we can't rely on their index of the array
    // as the starting index
    let songIndex = 0;
    const songIds = [];
    for (let i = 0; i < this.songItems.length; i++) {
      const current = this.songItems[i];
      if (!current.attributes) {
        continue;
      }

      if (current.id === songId) {
        songIndex = songIds.length;
      }
      songIds.push(current.id);
    }

    this.playSongs({
      songIds,
      startSongIndex: songIndex
    });
  }

  async $_updateSongItems() {
    // If the collection is a playlist, we want to fetch its songs' 'artists' relationships
    if (this.collection && this.collection.type === 'playlists') {
      // we're sure that collection is NOT null, so tracksFromCollection is not null
      const songIds = this.tracksFromCollection!.map(song => song.id);
      const songsWithRelationships = await this.fetchCatalogSongsDetails(
        songIds
      );

      this.songItems = songsWithRelationships;
    } else {
      // otherwise just use tracksFromCollection or songs
      this.songItems = this.tracksFromCollection || this.songs;
    }
  }
}
