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
          <PlayQueueHistory />
          <CurrentPlaying />
          <YourQueue />
          <PlayQueueUpNext />
        </v-flex>
      </v-layout>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Action, Getter, Mutation } from 'vuex-class';

import PlayQueueHistory from './PlayQueueHistory.vue';
import PlayQueueUpNext from './PlayQueueUpNext.vue';
import CurrentPlaying from './CurrentPlaying.vue';
import YourQueue from './YourQueue.vue';
import { TOGGLE_QUEUE_VISIBILITY } from '@/store/actions.type';

@Component({
  components: {
    PlayQueueHistory,
    PlayQueueUpNext,
    CurrentPlaying,
    YourQueue
  }
})
export default class PlayQueue extends Vue {
  @State(state => state.playQueue.visibility) visibility!: boolean;

  @Action
  [TOGGLE_QUEUE_VISIBILITY]: () => void;
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
