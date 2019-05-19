<template>
  <v-flex :class="$style['items']" v-if="upNext.length > 0">
    <VirtualList :size="60" :remain="15" :bench="10" :debounce="15">
      <PlayQueueSongList
        :songs="upNext"
        :onSongClicked="(songId, songIndex) => moveToIndexInQueue(songIndex)"
        @remove-from-queue="removeFromQueue"
      />
    </VirtualList>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue';
import { Getter, Action } from 'vuex-class';
import Component from 'vue-class-component';
// @ts-ignore
import VirtualList from 'vue-virtual-scroll-list';

import PlayQueueSongList from './PlayQueueSongList.vue';

@Component({
  components: {
    PlayQueueSongList,
    VirtualList
  }
})
export default class UpNext extends Vue {
  @Getter
  upNext!: MusicKit.MediaItem[];

  @Action removeFromQueue!: (index: number) => void;
  @Action moveToIndexInQueue!: (index: number) => void;
}
</script>

<style lang="scss" module>
.items {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
