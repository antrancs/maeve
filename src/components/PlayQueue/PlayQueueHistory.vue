<template>
  <div>
    <template v-if="history.length > 0">
      <PlayQueueSongItem
        v-for="(song, index) in history"
        :key="song.qId"
        :song="song"
        :index="index"
        :isHistory="true"
        @remove-from-queue="handleRemoveFromHistory"
        @song-item-clicked="handleHistoryItemClicked"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Getter, Action } from 'vuex-class';

import PlayQueueSongItem from './PlayQueueSongItem.vue';
import { PlayQueueSong } from '@/@types/model/model';
import {
  REMOVE_FROM_HISTORY,
  CHANGE_TO_INDEX_IN_HISTORY
} from '@/store/actions.type';
import { RemoveFromMainSongsAction, ChangeToIndexAction } from '@/store/types';

@Component({
  components: {
    PlayQueueSongItem
  }
})
export default class PlayQueueHistory extends Vue {
  @Getter history!: PlayQueueSong[];

  @Action [REMOVE_FROM_HISTORY]: RemoveFromMainSongsAction;
  @Action [CHANGE_TO_INDEX_IN_HISTORY]: ChangeToIndexAction;

  handleRemoveFromHistory(index: number) {
    this.removeFromHistory({
      index,
      qId: this.history[index].qId
    });
  }

  handleHistoryItemClicked(songId: string, index: number) {
    this.changeToIndexInHistory({
      index
    });
  }
}
</script>
