<template>
  <div>
    <app-button class="ml-0 mb-0" @on-click="onPlayBtnClicked">Play</app-button>
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
import { PLAY_COLLECTION, SHOW_MEDIA_ACTION_MENU } from '@/store/actions.type';
import { PlayCollectionAction, ShowMediaActionMenuAction } from '@/store/types';

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
  [PLAY_COLLECTION]: PlayCollectionAction;
  @Action [SHOW_MEDIA_ACTION_MENU]: ShowMediaActionMenuAction;

  /**
   * Play the entire collection
   */
  onPlayBtnClicked() {
    // Start with the first song by default
    this.playCollection({
      collectionId: this.collection.id,
      collectionType: this.collection.type
    });
  }

  /**
   * Shuffle the collection and play
   */
  shuffleSongs() {
    this.playCollection({
      collectionId: this.collection.id,
      collectionType: this.collection.type,
      shuffle: true
    });
  }

  showActionMenu(event: MouseEvent) {
    this.showMediaActionMenu({
      posX: event.clientX,
      posY: event.clientY,
      item: this.collection,
      isQueue: false
    });
  }
}
</script>
