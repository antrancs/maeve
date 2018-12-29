<template>
  <div>
    <v-btn
      @click="playCollection"
      :color="this.$vuetify.theme.accent"
      class="ml-0 mb-0"
    >
      {{ isCollectionBeingPlayed ? 'Pause' : 'Play' }}
    </v-btn>
    <v-btn
      @click="shuffleSongs"
      :color="this.$vuetify.theme.accent"
      class="mb-0"
    >
      Shuffle
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Collection } from '@/@types/model/model';
import { State, Action } from 'vuex-class';
import { PLAY_COLLECTION_WITH_SONG } from '@/store/actions.type';
import { PlayCollectionWithSongAction } from '@/store/types';

@Component
export default class CollectionControls extends Vue {
  @Prop() collection!: Collection;

  @State(state => state.musicPlayer.isPlaying)
  isPlaying!: boolean;

  @Action
  [PLAY_COLLECTION_WITH_SONG]: PlayCollectionWithSongAction;

  get isCollectionBeingPlayed(): boolean {
    if (!this.collection) {
      return false;
    }
    return (
      this.$store.getters.isCollectionBeingPlayed(this.collection.id) &&
      this.isPlaying
    );
  }

  /**
   * Play the entire collection
   */
  playCollection() {
    // Start with the first song by default
    this.playCollectionWithSong({
      collection: this.collection
    });
  }

  /**
   * Shuffle the collection and play
   */
  shuffleSongs() {
    this.playCollectionWithSong({
      collection: this.collection,
      shuffle: true
    });
  }
}
</script>
