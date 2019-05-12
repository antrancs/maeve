import { Component, Prop, Mixins } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';

import GoToArtistPageMixin from '@/mixins/GoToArtistPageMixin';
import GoToAlbumPageMixin from '@/mixins/GoToAlbumPageMixin';
import { Song, SongSourceInfo } from '@/@types/model/model';

import { MusicPlayerState, PlaySongsAction } from '@/store/types';
import { PLAY_SONGS } from '@/store/actions.type';

@Component
export default class SongListMixin extends Mixins(
  GoToAlbumPageMixin,
  GoToArtistPageMixin
) {
  @Prop()
  songs!: Song[];
  @Prop({ default: false }) isChart!: boolean;
  @Prop({ default: false }) fromAlbum!: boolean;
  @Prop() onSongClicked:
    | ((songId: string, songIndex: number) => void)
    | undefined;
  @Prop() sourceInfo: SongSourceInfo | undefined;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [PLAY_SONGS]: PlaySongsAction;

  handleActionIconClick(song: Song, posX: number, posY: number) {
    // @ts-ignore
    this.$root.$mediaActionMenu.open(song, this.collection, posX, posY, false);
  }

  handleSongClicked(songId: string, songIndex: number) {
    if (this.onSongClicked) {
      this.onSongClicked(songId, songIndex);
      return;
    }

    if (!this.sourceInfo) {
      return;
    }

    this.playSongs({
      songs: this.songs,
      startPosition: songIndex,
      sourceInfo: this.sourceInfo
    });
  }
}
