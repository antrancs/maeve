<template>
  <div>
    <template v-if="yourQueue.length > 0">
      <v-layout row wrap justify-space-between align-center class="ml-2 mt-3">
        <h4>Your Queue</h4>
        <app-button @on-click="handleShuffle">Shuffle</app-button>
      </v-layout>
      <PlayQueueSongItem
        v-for="(song, index) in yourQueue"
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
import { State, Mutation, Action, Getter } from 'vuex-class';

import PlayQueueSongItem from './PlayQueueSongItem.vue';
import { PlayQueueSong } from '@/@types/model/model';
import { REMOVE_FROM_YOUR_QUEUE } from '@/store/mutations.type';
import {
  CHANGE_TO_INDEX_IN_YOUR_QUEUE,
  SHUFFLE_YOUR_QUEUE
} from '@/store/actions.type';
import { ChangeToIndexAction } from '@/store/types';

@Component({
  components: {
    PlayQueueSongItem
  }
})
export default class YourQueue extends Vue {
  @Getter yourQueue!: PlayQueueSong[];

  @Action [CHANGE_TO_INDEX_IN_YOUR_QUEUE]: ChangeToIndexAction;
  @Action [SHUFFLE_YOUR_QUEUE]: () => void;

  @Mutation [REMOVE_FROM_YOUR_QUEUE]!: (index: number) => void;

  handleYourQueueItemClicked(songId: string, index: number) {
    this.changeToIndexInYourQueue({
      index
    });
  }

  handleShuffle() {
    this.shuffleYourQueue();
  }
}
</script>
