<template>
  <div>
    <transition name="slide-fade">
      <div v-if="showSongQueue" class="song-queue-modal">
        <div class="container">
          <h2 class="queue-title">Song queue</h2>
          <div class="queue-items">
            <song-list
              :tracks="queuedSongs"
              :is-queue="true"
            >
            </song-list>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Action } from 'vuex-class';
import { Prop, Component, Provide } from 'vue-property-decorator';

import SongList from '@/components/SongList.vue';
import { HandleSongClicked } from '@/@types/model/model';
import { SkipToSongAtIndexAction } from '@/store/types';
import { SKIP_TO_SONG_AT_INDEX } from '@/store/actions.type';

@Component({
  components: {
    SongList
  }
})
export default class SongQueue extends Vue {
  // Props
  @Prop({ default: false })
  showSongQueue!: boolean;

  // State
  @State(state => state.musicPlayer.queuedSongs)
  queuedSongs!: MusicKit.MediaItem[];

  // Action
  @Action [SKIP_TO_SONG_AT_INDEX]!: SkipToSongAtIndexAction;

  // Provide/Inject
  @Provide() handleSongClicked: HandleSongClicked = this.$_playSongFromQueue;

  // Helper methods
  /**
   * Play a specified song in the queue
   * @param index Index of the song
   * @param songId Id of the song
   */
  $_playSongFromQueue(index: number, songId: string) {
    // Just skip to the song in the queue. No need to re-initialize the queu
    this.skipToSongAtIndex({
      index
    });
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: transform 0.6s ease;
}

.slide-fade-leave-active {
  transition: transform 0.6s;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(41rem);
}

.song-queue-modal {
  box-shadow: 0 0.3rem 0.7rem 1rem rgba(0, 0, 0, 0.15),
    0 2rem 6rem 0 rgba(0, 0, 0, 0.2);
  display: flex;
  position: fixed;
  height: calc(100vh - 18rem);
  right: $l-size;
  top: $header-height + $s-size;
  width: 36.8rem;
  z-index: 1000;
}

.container {
  background-color: #242328;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.queue-items {
  flex: 1;
  overflow-y: auto;
}

.queue-title {
  padding-left: $s-size;
}
</style>

