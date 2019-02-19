<template>
  <div>
    <template v-if="currentPlaying">
      <h4 class="mx-2 mt-3">Playing from: {{ currentPlayingSource }}</h4>
      <PlayQueueSongItem :song="currentPlaying" :isNowPlaying="true" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';

import PlayQueueSongItem from './PlayQueueSongItem.vue';
import { PlayQueueSong, Nullable } from '@/@types/model/model';

@Component({
  components: {
    PlayQueueSongItem
  }
})
export default class CurrentPlaying extends Vue {
  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: Nullable<PlayQueueSong>;
  @State(state => state.musicPlayer.currentPlayingSource)
  currentPlayingSource!: string;
}
</script>
