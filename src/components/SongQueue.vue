<template>
  <div>
    <transition name="slide-fade">
      <div v-if="visibility" class="queue-modal">
        <div class="queue__container">
          <div class="queue__header flex-row">
            <h2 class="queue__title">Song queue</h2>
            <button @click="toggleQueueVisibility" class="btn btn--icon">
              <icon name="times" class="icon icon--l"></icon>
            </button>
          </div>
          <div class="queue__items">
            <SongList :tracks="queuedSongs" :is-queue="true" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Action, Mutation } from 'vuex-class';
import { Prop, Component, Provide } from 'vue-property-decorator';
import 'vue-awesome/icons/times';

import SongList from '@/components/SongList.vue';
import { HandleSongClicked } from '@/@types/model/model';
import { SkipToSongAtIndexAction } from '@/store/types';
import { SKIP_TO_SONG_AT_INDEX } from '@/store/actions.type';
import { TOGGLE_QUEUE_VISIBILITY } from '@/store/mutations.type';

@Component({
  components: {
    SongList
  }
})
export default class SongQueue extends Vue {
  @State(state => state.musicPlayer.queuedSongs)
  queuedSongs!: MusicKit.MediaItem[];
  @State(state => state.songQueue.visibility) visibility!: Boolean;

  @Action
  [SKIP_TO_SONG_AT_INDEX]!: SkipToSongAtIndexAction;

  @Mutation
  [TOGGLE_QUEUE_VISIBILITY]: () => void;

  @Provide()
  handleSongClicked: HandleSongClicked = this.$_playSongFromQueue;

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

<style lang="scss" scoped>
@import '@/styles/components/_song-queue.scss';
</style>
