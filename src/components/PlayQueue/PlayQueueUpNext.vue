<template>
  <div>
    <template v-if="upNext.length > 0">
      <h4 class="mx-2 mt-3">Up Next from: {{ mainSongsSource }}</h4>
      <PlayQueueSongItem
        v-for="(song, index) in upNext"
        :key="song.qId"
        :index="index"
        :song="song"
        @remove-from-queue="handleRemoveFromUpNext"
        @song-item-clicked="handleUpNextItemClicked"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Action, Getter } from 'vuex-class';
import PlayQueueSongItem from './PlayQueueSongItem.vue';

import {
  REMOVE_FROM_UP_NEXT,
  CHANGE_TO_INDEX_IN_UP_NEXT
} from '@/store/actions.type';
import { RemoveFromMainSongsAction, ChangeToIndexAction } from '@/store/types';
import { PlayQueueSong } from '@/@types/model/model';

@Component({
  components: {
    PlayQueueSongItem
  }
})
export default class PlayQueueUpNext extends Vue {
  @State(state => state.playQueue.mainSongsSource) mainSongsSource!: string;

  @Getter upNext!: PlayQueueSong[];

  @Action [REMOVE_FROM_UP_NEXT]: RemoveFromMainSongsAction;
  @Action [CHANGE_TO_INDEX_IN_UP_NEXT]: ChangeToIndexAction;

  handleUpNextItemClicked(songId: string, index: number) {
    this.changeToIndexInUpNext({
      index
    });
  }

  handleRemoveFromUpNext(index: number) {
    this.removeFromUpNext({
      index,
      qId: this.upNext[index].qId
    });
  }
}
</script>
