<template>
  <div>
    <app-button class="ml-0 mb-0" @on-click="playCollection">Play</app-button>
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
import MediaActionMenu from '@/components/MediaActionMenu.vue';
import { PLAY_SONGS } from '@/store/actions.type';
import { PlaySongsAction } from '@/store/types';

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
  [PLAY_SONGS]: PlaySongsAction;

  /**
   * Play the entire collection
   */
  playCollection() {
    // Start with the first song by default
    this.playSongs({
      collectionId: this.collection.id,
      collectionType: this.collection.type,
      songs: this.songs,
      songsSourceName: this.collection.attributes
        ? this.collection.attributes.name
        : ''
    });
  }

  /**
   * Shuffle the collection and play
   */
  shuffleSongs() {
    this.playSongs({
      collectionId: this.collection.id,
      collectionType: this.collection.type,
      shuffle: true,
      songs: this.songs,
      songsSourceName: this.collection.attributes
        ? this.collection.attributes.name
        : ''
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
