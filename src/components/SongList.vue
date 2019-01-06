<template>
  <v-layout column>
    <v-flex xs12>
      <SongItem
        :key="track.id"
        v-for="(track, index) in tracks"
        :song="track"
        :index="index"
        :is-from-album="fromAlbum"
        :is-queue="isQueue"
        @song-item-clicked="handleSongClicked"
        @actions-icon-click="handleActionIconClick"
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

import {
  Collection,
  Nullable,
  CollectionType,
  Song,
  SnackbarMode
} from '@/@types/model/model';
import {
  MusicPlayerState,
  SkipToSongAtIndexAction,
  PlaySongsAction
} from '@/store/types';
import { SKIP_TO_SONG_AT_INDEX, PLAY_SONGS } from '@/store/actions.type';

import SongItem from '@/components/SongItem.vue';
import MediaActionMenu from '@/components/MediaActionMenu.vue';

@Component({
  components: { SongItem, MediaActionMenu }
})
export default class SongList extends Vue {
  private showSongActionMenu = false;
  private actionMenuPosX = 0;
  private actionMenuPosY = 0;
  private selectedSong: Nullable<Song> = null; // when clicking on actions icon

  @Prop()
  collection!: Collection | undefined;
  @Prop()
  tracks!: MusicKit.Song[];
  @Prop({ default: false })
  isQueue!: boolean;
  // @Prop({ default: false }) isFromLibrary!: boolean;
  @Prop() playlistId: Nullable<string>;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [SKIP_TO_SONG_AT_INDEX]: SkipToSongAtIndexAction;
  @Action
  [PLAY_SONGS]: PlaySongsAction;

  get fromAlbum(): boolean {
    return (
      this.collection !== undefined &&
      (this.collection.type === CollectionType.album ||
        this.collection.type === CollectionType.libraryAlbum)
    );
  }

  handleSongClicked(songId: string, songIndex: number) {
    if (this.isQueue) {
      this.skipToSongAtIndex({ index: songIndex });
    } else {
      const songIds = this.tracks.map(song => song.id);

      this.playSongs({
        songIds,
        startSongIndex: songIndex
      });
    }
  }

  handleActionIconClick(song: Song, posX: number, posY: number) {
    // @ts-ignore
    this.$root.$mediaActionMenu.open(song, this.collection, posX, posY);
  }
}
</script>

<style lang="scss" scoped>
.icon-playing {
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 4;
}
</style>
