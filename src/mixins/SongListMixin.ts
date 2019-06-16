import { Component, Prop, Mixins } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';

import GoToArtistPageMixin from '@/mixins/GoToArtistPageMixin';
import GoToAlbumPageMixin from '@/mixins/GoToAlbumPageMixin';
import { Song, SongSourceInfo } from '@/@types/model/model';

import {
  MusicPlayerState,
  PlaySongsAction,
  ShowMediaActionMenuAction
} from '@/store/types';
import {
  PLAY_SONGS,
  TOGGLE_CURRENT_TRACK,
  SHOW_MEDIA_ACTION_MENU
} from '@/store/actions.type';

@Component
export default class SongListMixin extends Mixins(
  GoToAlbumPageMixin,
  GoToArtistPageMixin
) {
  @Prop()
  songs!: Song[];
  @Prop({ default: false }) fromAlbum!: boolean;
  @Prop() onSongClicked:
    | ((songId: string, songIndex: number) => void)
    | undefined;
  @Prop() sourceInfo: SongSourceInfo | undefined;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;
  @Action
  [PLAY_SONGS]: PlaySongsAction;
  @Action [SHOW_MEDIA_ACTION_MENU]: ShowMediaActionMenuAction;

  isSongActive(song: Song): boolean {
    if (!this.musicPlayer.currentPlaying) {
      return false;
    }

    const currentPlayingId = this.musicPlayer.currentPlaying.id;

    if (song.type === 'library-songs' && song.attributes) {
      return song.attributes.playParams!.catalogId === currentPlayingId;
    }

    return song.id === currentPlayingId;
  }

  handleActionIconClick(song: Song, posX: number, posY: number) {
    this.showMediaActionMenu({
      posX,
      posY,
      isQueue: false,
      item: song
    });
  }

  handleSongClicked(songId: string, songIndex: number) {
    if (
      this.musicPlayer.currentPlaying &&
      this.musicPlayer.currentPlaying.id === songId
    ) {
      this.toggleCurrentTrack();
      return;
    }

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
