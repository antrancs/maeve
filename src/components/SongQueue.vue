<template>
  <div>
    <transition name="slide-fade">
      <div v-if="showSongQueue" class="song-queue-modal">
        <div class="container">
          <div>
            <h1>Header</h1>
          </div>
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
import { State } from 'vuex-class';
import { Prop, Component } from 'vue-property-decorator';

import SongList from './SongList.vue';

@Component({
  components: {
    SongList
  }
})
export default class SongQueue extends Vue {
  @Prop({ default: false })
  showSongQueue!: boolean;

  @State(state => state.musicPlayer.queuedSongs)
  queuedSongs!: MusicKit.MediaItem[];
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: transform 0.6s ease;
}

.slide-fade-leave-active {
  transition: transform 0.6s;
}

.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(412px);
}

.song-queue-modal {
  display: flex;
  position: fixed;
  height: calc(100vh - 166px);
  right: 24px;
  top: 60px;
  width: 368px;
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
  // display: flex;
  // flex-direction: column;
  overflow-y: auto;
}
</style>

