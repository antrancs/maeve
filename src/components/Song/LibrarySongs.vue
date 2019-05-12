<template>
  <v-layout column>
    <v-flex xs12>
      <VirtualList :size="60" :remain="15" :bench="45" :debounce="15">
        <SongListLargeItem
          :key="`${song.id}-${index}`"
          v-for="(song, index) in songs"
          :song="song"
          :index="index"
          :is-from-album="fromAlbum"
          @song-item-clicked="handleSongClicked"
          @actions-icon-click="handleActionIconClick"
        />
      </VirtualList>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
// @ts-ignore
import VirtualList from 'vue-virtual-scroll-list';

import SongListLargeItem from './SongListLargeItem.vue';
import SongListMixin from '@/mixins/SongListMixin';

@Component({
  components: { VirtualList, SongListLargeItem }
})
export default class LibrarySongs extends Mixins(SongListMixin) {
  private songItem = SongListLargeItem;

  handleSongClicked(songId: string, songIndex: number) {
    // shuffle = false
    this.$emit('play-songs', songIndex, false);
  }
}
</script>

<style lang="scss" scoped>
.scroller {
  height: 100%;
}

.scroll-item {
  height: 6rem;
}
</style>
