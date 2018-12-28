<template>
  <v-layout column>
    <v-flex xs12>
      <SongItem
        :key="track.id"
        v-for="(track, index) in tracks"
        :song="track"
        :index="index"
        :is-from-album="isFromAlbum"
        :is-queue="isQueue"
        @play-next="handleAddNext"
        @add-to-queue="handleAddToQueue"
        @add-to-library="handleAddToLibrary"
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

import { Collection, Nullable, CollectionType } from '@/@types/model/model';
import {
  AppendSongsPayload,
  AddToLibraryPayload,
  MusicPlayerState,
  AppendSongsAction,
  AddToLibraryAction,
  PrependSongsAction,
  ShowSnackbarAction
} from '@/store/types';
import {
  ADD_TO_LIBRARY,
  APPEND_SONGS,
  PREPEND_SONGS
} from '@/store/actions.type';

import SongItem from '@/components/SongItem.vue';

@Component({
  components: { SongItem }
})
export default class SongList extends Vue {
  @Prop()
  collection!: Collection | undefined;
  @Prop()
  tracks!: MusicKit.Song[];
  @Prop({ default: false })
  isQueue!: boolean;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [APPEND_SONGS]: AppendSongsAction;
  @Action
  [PREPEND_SONGS]: PrependSongsAction;
  @Action
  [ADD_TO_LIBRARY]: AddToLibraryAction;

  @Action showSnackbar!: ShowSnackbarAction;

  get isFromAlbum(): boolean {
    return (
      this.collection !== undefined &&
      (this.collection.type === CollectionType.album ||
        this.collection.type === CollectionType.libraryAlbum)
    );
  }

  handleAddToQueue(song: MusicKit.Song) {
    if (!song) {
      return;
    }

    const mediaItem = new MusicKit.MediaItem({
      id: song.id,
      attributes: song.attributes,
      type: 'song'
    });

    // appendSongs is synchronous
    this.appendSongs({ items: [mediaItem] });

    this.showSnackbar({
      text: 'Song added to queue'
    });
  }

  handleAddNext(song: MusicKit.Song) {
    if (!song) {
      return;
    }

    const mediaItem = new MusicKit.MediaItem({
      id: song.id,
      attributes: song.attributes,
      type: 'song'
    });

    this.prependSongs({ items: [mediaItem] });

    this.showSnackbar({
      text: 'Song added next'
    });
  }

  handleAddToLibrary(song: MusicKit.Song) {
    if (!song) {
      return;
    }

    this.addToLibrary({
      itemIds: [song.id],
      type: 'songs'
    })
      .then(() => {
        this.showSnackbar({
          text: 'Song added to library'
        });
      })
      .catch(err => {
        console.log(err);

        this.showSnackbar({
          text: 'Something went wrong.'
        });
      });
  }
}
</script>

<style lang="scss" scoped>
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
  z-index: 4;
}
</style>
