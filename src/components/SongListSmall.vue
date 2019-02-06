<template>
  <v-layout column>
    <v-flex xs12>
      <SongListSmallItem
        :key="`${song.id}-${index}`"
        v-for="(song, index) in songs"
        :song="song"
        :index="index"
        :isQueue="isQueue"
        :isChart="isChart"
        :textColor="textColor"
        :is-from-album="fromAlbum"
        @song-item-clicked="handleSongClicked"
        @actions-icon-click="handleActionIconClick"
        @remove-from-queue="handleRemoveFromQueue"
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

import {
  Collection,
  Nullable,
  CollectionType,
  Song,
  SnackbarMode
} from '@/@types/model/model';
import { SkipToSongAtIndexAction } from '@/store/types';

import SongListSmallItem from '@/components/SongListSmallItem.vue';
import SongListMixin from '@/mixins/SongListMixin';
import {
  REMOVE_SONG_FROM_QUEUE,
  SKIP_TO_SONG_AT_INDEX
} from '@/store/actions.type';

@Component({
  components: { SongListSmallItem }
})
export default class SongListSmall extends Mixins(SongListMixin) {
  @Prop({ default: false })
  isQueue!: boolean;
  @Prop() textColor!: Nullable<string>;

  @Action [REMOVE_SONG_FROM_QUEUE]: (index: number) => void;
  @Action
  [SKIP_TO_SONG_AT_INDEX]: SkipToSongAtIndexAction;

  handleActionIconClick(song: Song, posX: number, posY: number) {
    // @ts-ignore
    this.$root.$mediaActionMenu.open(
      song,
      this.collectionId,
      posX,
      posY,
      this.isQueue
    );
  }

  handleSongClicked(songId: string, songIndex: number) {
    if (this.isQueue) {
      this.skipToSongAtIndex({ index: songIndex });
    } else {
      this.handlePlaySongs(songId);
    }
  }

  handleRemoveFromQueue(index: number) {
    this.removeSongFromQueue(index);
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
