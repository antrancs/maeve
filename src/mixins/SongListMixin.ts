import { Component, Vue, Prop } from 'vue-property-decorator';
import { Nullable, Song } from '@/@types/model/model';
import { State, Action } from 'vuex-class';
import { MusicPlayerState, PlaySongsAction } from '@/store/types';
import { PLAY_SONGS } from '@/store/actions.type';

@Component
export default class SongListMixin extends Vue {
  @Prop()
  collectionId: string | undefined;

  // the source where the song list is from (album/playlist, search results...)
  @Prop()
  sourceName!: string;

  @Prop()
  songs!: Song[];
  @Prop({ default: false }) isChart!: boolean;
  @Prop() playlistId: Nullable<string>;
  @Prop({ default: false }) fromAlbum!: boolean;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [PLAY_SONGS]: PlaySongsAction;

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
      songsSourceName: this.sourceName,
      startSongIndex: songIndex,
      collectionId: this.collectionId,
      collectionType: this.fromAlbum ? 'albums' : 'playlists'
    });
  }

  handleActionIconClick(song: Song, posX: number, posY: number) {
    // @ts-ignore
    this.$root.$mediaActionMenu.open(song, this.collection, posX, posY, false);
  }

  handleSongClicked(songId: string, songIndex: number) {
    this.handlePlaySongs(songId);
  }
}
