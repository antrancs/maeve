<template>
  <div>
    <app-button class="ml-0 mb-0" @on-click="playCollection">{{
      isCollectionBeingPlayed ? 'Pause' : 'Play'
    }}</app-button>
    <app-button class="mb-0" @on-click="shuffleSongs">Shuffle</app-button>
    <v-btn fab dark class="accent mb-0" small @click="showActionMenu">
      <v-icon medium>more_horiz</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Collection, CollectionType } from '@/@types/model/model';
import { State, Action } from 'vuex-class';
import { PLAY_COLLECTION_WITH_SONG } from '@/store/actions.type';
import { PlayCollectionWithSongAction } from '@/store/types';
import MediaActionMenu from '@/components/MediaActionMenu.vue';

@Component({
  components: {
    MediaActionMenu
  }
})
export default class CollectionControls extends Vue {
  @Prop() collection!: Collection;
  @Prop() songs!: MusicKit.Song[];

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
      collection: this.collection,
      songs: this.songs
    });
  }

  /**
   * Shuffle the collection and play
   */
  shuffleSongs() {
    this.playCollectionWithSong({
      collection: this.collection,
      shuffle: true,
      songs: this.songs
    });
  }

  showActionMenu(event: MouseEvent) {
    // @ts-ignore
    this.$root.$mediaActionMenu.open(
      this.collection,
      null,
      event.clientX,
      event.clientY
    );
  }
}
</script>
