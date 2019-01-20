<template>
  <v-layout column>
    <v-flex xs12>
      <SongListLargeItem
        :key="`${track.id}-${index}`"
        v-for="(track, index) in tracks"
        :song="track"
        :index="index"
        :is-from-album="fromAlbum"
        @song-item-clicked="handleSongClicked"
        @actions-icon-click="handleActionIconClick"
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
import { MusicPlayerState } from '@/store/types';

import SongListLargeItem from '@/components/SongListLargeItem.vue';
import SongItemMixin from '@/mixins/SongListMixin';

@Component({
  components: { SongListLargeItem }
})
export default class SongListLarge extends Mixins(SongItemMixin) {
  get fromAlbum(): boolean {
    return (
      this.collection !== undefined &&
      (this.collection.type === CollectionType.album ||
        this.collection.type === CollectionType.libraryAlbum)
    );
  }

  handleActionIconClick(song: Song, posX: number, posY: number) {
    // @ts-ignore
    this.$root.$mediaActionMenu.open(song, this.collection, posX, posY, false);
  }

  handleSongClicked(songId: string, songIndex: number) {
    this.handlePlaySongs(songId);
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
