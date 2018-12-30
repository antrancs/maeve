<template>
  <v-layout column>
    <v-flex xs12>
      <SongItem
        :key="track.id"
        v-for="(track, index) in tracks"
        :song="track"
        :index="index"
        :playlistId="playlistId"
        :is-from-album="fromAlbum"
        :is-queue="isQueue"
        :isFromLibrary="fromLibrary"
        @play-next="handleAddNext"
        @add-to-queue="handleAddToQueue"
        @add-to-library="handleAddToLibrary"
        @song-item-clicked="handleSongClicked"
        @add-song-to-playlist="handleAddSongToPlaylist"
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

import {
  Collection,
  Nullable,
  CollectionType,
  Song,
  SnackbarMode
} from '@/@types/model/model';
import {
  AppendSongsPayload,
  AddToLibraryPayload,
  MusicPlayerState,
  AppendSongsAction,
  AddToLibraryAction,
  PrependSongsAction,
  ShowSnackbarAction,
  SkipToSongAtIndexAction,
  PlaySongsAction,
  AddSongsToPlaylistAction
} from '@/store/types';
import {
  ADD_TO_LIBRARY,
  APPEND_SONGS,
  PREPEND_SONGS,
  SKIP_TO_SONG_AT_INDEX,
  PLAY_SONGS,
  ADD_SONGS_TO_PLAYLIST,
  SHOW_SNACKBAR
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
  @Prop({ default: false }) isFromLibrary!: boolean;
  @Prop() playlistId: Nullable<string>;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [APPEND_SONGS]: AppendSongsAction;
  @Action
  [PREPEND_SONGS]: PrependSongsAction;
  @Action
  [ADD_TO_LIBRARY]: AddToLibraryAction;
  @Action
  [SKIP_TO_SONG_AT_INDEX]: SkipToSongAtIndexAction;
  @Action
  [PLAY_SONGS]: PlaySongsAction;
  @Action
  [ADD_SONGS_TO_PLAYLIST]: AddSongsToPlaylistAction;
  @Action [SHOW_SNACKBAR]!: ShowSnackbarAction;

  get fromAlbum(): boolean {
    return (
      this.collection !== undefined &&
      (this.collection.type === CollectionType.album ||
        this.collection.type === CollectionType.libraryAlbum)
    );
  }

  get fromLibrary(): boolean {
    return (
      this.isFromLibrary ||
      (this.collection !== undefined &&
        (this.collection.type === CollectionType.libraryAlbum ||
          this.collection.type === CollectionType.libraryPlaylist))
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

  handleSongClicked(songId: string, songIndex: number) {
    if (this.isQueue) {
      this.skipToSongAtIndex({ index: songIndex });
    } else {
      const songIds = this.tracks.map(song => song.id);

      this.playSongs({
        songIds,
        startSongIndex: songIndex
      });
    }
  }

  async handleAddSongToPlaylist(playlistId: string, { id, type }: Song) {
    try {
      await this.addSongsToPlaylist({
        songItems: [
          {
            id,
            type
          }
        ],
        playlistId
      });

      this.showSnackbar({
        text: 'Song has been added to your playlist'
      });
    } catch {
      this.showSnackbar({
        text: 'Cannot add song to library. Please try again later',
        type: SnackbarMode.error
      });
    }
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
