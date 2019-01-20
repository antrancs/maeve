import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Collection, Nullable, Song } from '@/@types/model/model';
import { State, Action } from 'vuex-class';
import { MusicPlayerState, PlaySongsAction } from '@/store/types';
import { PLAY_SONGS } from '@/store/actions.type';

@Component
export default class SongListMixin extends Vue {
  @Prop()
  collection!: Collection | undefined;
  @Prop()
  tracks!: MusicKit.Song[];
  @Prop({ default: false }) isChart!: boolean;
  @Prop() playlistId: Nullable<string>;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [PLAY_SONGS]: PlaySongsAction;

  handlePlaySongs(songId: string) {
    // Since there might be some unavailable songs, we can't rely on their index of the array
    // as the starting index
    let songIndex = 0;
    const songIds = [];
    for (let i = 0; i < this.tracks.length; i++) {
      const current = this.tracks[i];
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
}
