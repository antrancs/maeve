<template>
  <div>
    <template v-if="queuedSongs.length > 0">
      <h4 class="mx-2 mt-3">Your Queue</h4>
      <PlayQueueSongItem
        v-for="(song, index) in queuedSongs"
        :key="song.qId"
        :song="song"
        :index="index"
        @remove-from-queue="removeFromYourQueue"
        @song-item-clicked="handleYourQueueItemClicked"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Mutation, Action } from 'vuex-class';

import PlayQueueSongItem from './PlayQueueSongItem.vue';
import { PlayQueueSong } from '@/@types/model/model';
import { REMOVE_FROM_YOUR_QUEUE } from '@/store/mutations.type';
import { CHANGE_TO_INDEX_IN_YOUR_QUEUE } from '@/store/actions.type';
import { ChangeToIndexAction } from '@/store/types';

@Component({
  components: {
    PlayQueueSongItem
  }
})
export default class YourQueue extends Vue {
  @State(state => state.playQueue.queue)
  queuedSongs!: PlayQueueSong[];

  @Action [CHANGE_TO_INDEX_IN_YOUR_QUEUE]: ChangeToIndexAction;
  @Mutation [REMOVE_FROM_YOUR_QUEUE]!: (index: number) => void;

  handleYourQueueItemClicked(songId: string, index: number) {
    this.changeToIndexInYourQueue({
      index
    });
  }
}
</script>
