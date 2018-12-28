<template>
  <div>
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
            <SongList :tracks="queuedSongs" :is-queue="true" />
          </v-flex>
        </v-layout>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Action, Mutation } from 'vuex-class';
import { Prop, Component, Provide } from 'vue-property-decorator';

import SongList from '@/components/SongList.vue';
import { HandleSongClicked, Song } from '@/@types/model/model';
import { SkipToSongAtIndexAction } from '@/store/types';
import {
  SKIP_TO_SONG_AT_INDEX,
  TOGGLE_QUEUE_VISIBILITY
} from '@/store/actions.type';

@Component({
  components: {
    SongList
  }
})
export default class PlayQueue extends Vue {
  @State(state => state.playQueue.songs)
  queuedSongs!: Song[];
  @State(state => state.playQueue.visibility) visibility!: Boolean;

  @Action
  [SKIP_TO_SONG_AT_INDEX]: SkipToSongAtIndexAction;
  @Action
  [TOGGLE_QUEUE_VISIBILITY]: () => void;

  @Provide()
  onSongItemClicked: HandleSongClicked = this.$_playSongFromQueue;

  // Helper methods
  /**
   * Play a specified song in the queue
   * @param index Index of the song
   * @param songId Id of the song
   */
  private $_playSongFromQueue(index: number, songId: string) {
    // Just skip to the song in the queue. No need to re-initialize the queue
    this.skipToSongAtIndex({
      index
    });
  }
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
