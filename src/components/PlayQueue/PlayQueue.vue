<template>
  <transition name="slide-fade">
    <div v-if="visibility" :class="$style['container']" class="mx-2">
      <v-layout column class="primary lighten-1">
        <v-flex shrink>
          <v-layout row justify-space-between align-center class="px-2">
            <h2>Play queue</h2>
            <v-btn icon @click="toggleQueueVisibility">
              <v-icon large>close</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>

        <v-flex :class="$style['items']">
          <template v-if="history.length > 0">
            <PlayQueueSongItem
              v-for="(song, index) in history"
              :key="song.qId"
              :song="song"
              :index="index"
              :isHistory="true"
              @remove-from-queue="removeFromHistory"
            />
          </template>

          <h4 class="mx-2 mt-3">Playing from: {{ currentPlayingSource }}</h4>
          <PlayQueueSongItem :song="currentPlaying" :isNowPlaying="true" />

          <template v-if="queuedSongs.length > 0">
            <h4 class="mx-2 mt-3">Your Queue</h4>
            <PlayQueueSongItem
              v-for="(song, index) in queuedSongs"
              :key="song.qId"
              :song="song"
              :index="index"
              @remove-from-queue="removeFromYourQueue"
            />
          </template>

          <h4 class="mx-2 mt-3">Up Next from: {{ mainSongsSource }}</h4>
          <PlayQueueSongItem
            v-for="(song, index) in upNext"
            :key="song.qId"
            :index="index"
            :song="song"
            @remove-from-queue="removeFromUpNext"
          />
        </v-flex>
      </v-layout>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Action, Getter, Mutation } from 'vuex-class';

import { PlayQueueSong } from '@/@types/model/model';
import PlayQueueSongItem from './PlayQueueSongItem.vue';
import {
  TOGGLE_QUEUE_VISIBILITY,
  REMOVE_FROM_UP_NEXT,
  REMOVE_FROM_HISTORY
} from '@/store/actions.type';
import { REMOVE_FROM_YOUR_QUEUE } from '@/store/mutations.type';

@Component({
  components: {
    PlayQueueSongItem
  }
})
export default class PlayQueue extends Vue {
  @State(state => state.playQueue.queue)
  queuedSongs!: PlayQueueSong[];
  @State(state => state.playQueue.visibility) visibility!: boolean;
  @State(state => state.playQueue.mainSongsSource) mainSongsSource!: boolean;
  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: string;
  @State(state => state.musicPlayer.currentPlayingSource)
  currentPlayingSource!: string;

  @Getter upNext!: PlayQueueSong[];
  @Getter history!: PlayQueueSong[];

  @Action
  [TOGGLE_QUEUE_VISIBILITY]: () => void;
  @Action [REMOVE_FROM_UP_NEXT]: (index: number) => void;
  @Action [REMOVE_FROM_HISTORY]: (index: number) => void;

  @Mutation [REMOVE_FROM_YOUR_QUEUE]!: (index: number) => void;
}
</script>

<style lang="scss" module>
.container {
  box-shadow: 0 0.3rem 0.7rem 1rem rgba(0, 0, 0, 0.15),
    0 2rem 6rem 0 rgba(0, 0, 0, 0.2);
  display: flex;
  position: fixed;
  height: calc(100vh - 18rem);
  margin-bottom: 10rem;
  max-width: 90vw;
  right: 0;
  top: $header-height + 0.8rem;
  width: 36.8rem;
  z-index: 5;
}

.items {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: transform 0.3s ease;
}

.slide-fade-leave-active {
  transition: transform 0.3s;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(40rem);
}
</style>
