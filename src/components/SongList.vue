<template>
  <div class="song-list">
    <song-item
      :key="track.id"
      v-for="(track, index) in tracks"
      :track="track"
      :index="index"
      :is-from-album="isFromAlbum"
      :is-queue="isQueue"
    >
    </song-item>

    <context-menu
      name="cm-song-list"
      @before-open="beforeOpenContextMenu"
      @before-close="beforeCloseContextMenu"
    >
      <context-menu-item :on-click="handleAddNext">Play next</context-menu-item>
      <context-menu-item :on-click="handleAddToQueue">Add to queue</context-menu-item>
      <context-menu-item :on-click="handleAddToLibrary">Add to library</context-menu-item>
    </context-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

import { Collection, Nullable, CollectionType } from '@/@types/model/model';
import {
  PlayCollectionAtIndexAction,
  AppendSongsPayload,
  AddToLibraryPayload,
  MusicPlayerState,
  AppendSongsAction,
  AddToLibraryAction,
  PrependSongsAction
} from '@/store/types';
import {
  PLAY_COLLECTION_AT_INDEX,
  ADD_TO_LIBRARY,
  APPEND_SONGS,
  PREPEND_SONGS
} from '@/store/actions.type';

import SongItem from '@/components/SongItem.vue';
import ContextMenu from '@/components/ContextMenu.vue';
import ContextMenuItem from '@/components/ContextMenuItem.vue';

@Component({
  components: { SongItem, ContextMenu, ContextMenuItem }
})
export default class SongList extends Vue {
  // Data
  private selectedTrack: Nullable<MusicKit.Song> = null;

  // Props
  @Prop()
  collection!: Collection | undefined;
  @Prop()
  tracks!: MusicKit.Song[];
  @Prop({ default: false })
  isQueue!: boolean;

  // State
  @State
  musicPlayer!: MusicPlayerState;

  // Action
  @Action
  [PLAY_COLLECTION_AT_INDEX]: PlayCollectionAtIndexAction;
  @Action
  [APPEND_SONGS]: AppendSongsAction;
  @Action
  [PREPEND_SONGS]: PrependSongsAction;
  @Action
  [ADD_TO_LIBRARY]: AddToLibraryAction;

  // Computed
  get isFromAlbum(): boolean {
    return (
      this.collection !== undefined &&
      (this.collection.type === CollectionType.album ||
        this.collection.type === CollectionType.libraryAlbum)
    );
  }

  // Methods
  beforeOpenContextMenu(event: any) {
    this.selectedTrack = event.params.selectedTrack;
  }

  beforeCloseContextMenu() {
    this.selectedTrack = null;
  }

  handleAddToQueue(event: MouseEvent) {
    if (!this.selectedTrack) {
      return;
    }
    const mediaItem = new MusicKit.MediaItem({
      id: this.selectedTrack.id,
      attributes: this.selectedTrack.attributes,
      type: 'song'
    });

    // appendSongs is synchronous
    this.appendSongs({ items: [mediaItem] });
    // @ts-ignore
    this.$toasted.global.notify({
      message: 'Song added to queue'
    });
  }

  handleAddNext() {
    if (!this.selectedTrack) {
      return;
    }
    const mediaItem = new MusicKit.MediaItem({
      id: this.selectedTrack.id,
      attributes: this.selectedTrack.attributes,
      type: 'song'
    });

    this.prependSongs({ items: [mediaItem] });

    // @ts-ignore
    this.$toasted.global.notify({
      message: 'Song added next'
    });
  }

  handleAddToLibrary() {
    if (!this.selectedTrack) {
      return;
    }

    this.addToLibrary({
      itemIds: [this.selectedTrack.id],
      type: 'songs'
    })
      .then(() =>
        // @ts-ignore
        this.$toasted.global.notify({
          message: 'Song added to library'
        })
      )
      .catch(err => {
        console.log(err);
        // @ts-ignore
        this.$toasted.global.error();
      });
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  width: 100%;
}

.icon-playing {
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 50;
}
</style>
