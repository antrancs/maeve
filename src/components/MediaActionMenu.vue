<template>
  <v-menu
    bottom
    left
    offset-y
    v-model="songActionsMenu"
    absolute
    :position-x="mediaActionMenu.posX"
    :position-y="mediaActionMenu.posY"
  >
    <slot slot="activator"></slot>
    <v-list class="secondary media-menu-content">
      <template v-if="isAuthenticated">
        <v-list-tile v-if="!isLibraryItem" @click="onAddToLibrary">
          <v-list-tile-title>Add to Library</v-list-tile-title>
        </v-list-tile>

        <v-menu offset-x left open-on-hover>
          <v-list-tile slot="activator">
            <v-list-tile-title>Add to Playlist</v-list-tile-title>
            <v-list-tile-action class="justify-end small-list-tile-action">
              <v-icon>arrow_right</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list class="secondary media-menu-content">
            <v-list-tile @click="onAddToNewPlaylist">
              <v-list-tile-content>
                <v-list-tile-title>New playlist</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile
              v-for="playlist in editablePlaylists"
              :key="playlist.id"
              @click="() => onAddToExistingPlaylist(playlist.id)"
            >
              <v-list-tile-action class="justify-start small-list-tile-action">
                <v-icon>queue_music</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>{{
                playlist.attributes.name
              }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>

      <template v-if="!songActionsMenu.isQueue">
        <v-divider></v-divider>
        <v-list-tile @click="onPlayNext">
          <v-list-tile-title>Play next</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="onAddToQueue">
          <v-list-tile-title>Add to queue</v-list-tile-title>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
// TO-DO: refactor this file
import Vue from 'vue';
import { Prop, Component, Watch } from 'vue-property-decorator';
import { Getter, State, Action } from 'vuex-class';
import { Nullable, Song, Collection, SnackbarMode } from '@/@types/model/model';
import {
  ADD_TO_LIBRARY,
  SHOW_SNACKBAR,
  ADD_SONGS_TO_PLAYLIST,
  PREPEND_SONGS_TO_QUEUE,
  OPEN_NEW_PLAYLIST_DIALOG,
  CLOSE_MEDIA_ACTION_MENU
} from '@/store/actions.type';
import {
  AddToLibraryAction,
  ShowSnackbarAction,
  PrependSongsAction,
  AddSongsToPlaylistAction,
  AppendSongsAction,
  OpenNewPlaylistDialogAction,
  MediaActionMenuState
} from '@/store/types';
import { getSongsFromCollection } from '@/utils/utils';

@Component
export default class MediaActionMenu extends Vue {
  private songActionsMenu = false;
  // we can add songs from album/playlist OR album/playlist OR item from the play queue
  // private item: Nullable<Song | Collection | MusicKit.MediaItem> = null;
  // only songs have a container
  // private containerId: Nullable<string> = null;

  @State(state => state.library.playlists)
  playlists!: MusicKit.LibraryPlaylist[];
  @State(state => state.mediaActionMenu) mediaActionMenu!: MediaActionMenuState;

  @Getter isAuthenticated!: boolean;

  @Action
  [ADD_TO_LIBRARY]: AddToLibraryAction;
  @Action [SHOW_SNACKBAR]: ShowSnackbarAction;
  @Action [PREPEND_SONGS_TO_QUEUE]: PrependSongsAction;
  @Action [ADD_SONGS_TO_PLAYLIST]: AddSongsToPlaylistAction;
  @Action appendSongsToQueue!: AppendSongsAction;
  @Action [OPEN_NEW_PLAYLIST_DIALOG]: OpenNewPlaylistDialogAction;
  @Action [CLOSE_MEDIA_ACTION_MENU]: () => void;

  get isLibraryItem() {
    if (!this.mediaActionMenu.item) {
      return false;
    }
    return (
      this.mediaActionMenu.item.type === 'library-songs' ||
      this.mediaActionMenu.item.type === 'library-albums' ||
      this.mediaActionMenu.item.type === 'library-playlists'
    );
  }

  get playlistId(): Nullable<string> {
    if (
      !this.mediaActionMenu.item ||
      this.mediaActionMenu.item.type !== 'library-playlists'
    ) {
      return null;
    }
    return this.mediaActionMenu.item.id;
  }

  get editablePlaylists() {
    return this.playlists.filter(playlist => {
      return (
        playlist.id !== this.playlistId &&
        playlist.attributes &&
        playlist.attributes.canEdit
      );
    });
  }

  @Watch('songActionsMenu')
  onSongActionsMenuModelChanged(newValue: boolean) {
    if (!newValue) {
      this.closeMediaActionMenu();
    }
  }

  created() {
    this.songActionsMenu = true;
  }

  async onAddToLibrary() {
    if (!this.mediaActionMenu.item) {
      return;
    }

    try {
      await this.addToLibrary({
        itemIds: [this.mediaActionMenu.item.id],
        type: this.mediaActionMenu.item.type
      });

      this.showSnackbar({
        text: 'Item has been added to library'
      });
    } catch (err) {
      this.showSnackbar({
        text: 'Cannot add item to library',
        type: SnackbarMode.error
      });
    }
  }

  onAddToNewPlaylist() {
    if (!this.mediaActionMenu.item) {
      return;
    }

    let itemsToAdd: (Song | MusicKit.MediaItem)[] = [];
    if (this.mediaActionMenu.item.type === 'song') {
      itemsToAdd = [this.mediaActionMenu.item];
    } else {
      itemsToAdd = this.$_getSongsToAdd();
    }

    this.openNewPlaylistDialog({
      itemsToAdd
    });
  }

  async onAddToExistingPlaylist(playlistId: string) {
    this.songActionsMenu = false;
    if (!this.mediaActionMenu.item) {
      return;
    }

    let itemsToAdd: (Song | MusicKit.MediaItem)[] = [];
    if (this.mediaActionMenu.item.type === 'song') {
      itemsToAdd = [this.mediaActionMenu.item];
    } else {
      itemsToAdd = this.$_getSongsToAdd();
    }

    const songs = itemsToAdd.map(({ id, type }) => ({
      id,
      type
    }));

    try {
      await this.addSongsToPlaylist({
        songItems: songs,
        playlistId
      });

      this.showSnackbar({
        text: 'Item has been added to playlist'
      });
    } catch (err) {
      this.showSnackbar({
        text: 'Cannot add item to playlist',
        type: SnackbarMode.error
      });
    }
  }

  onPlayNext() {
    const songsToAdd = this.$_getSongsToAdd();

    const mediaItems = songsToAdd.map(
      ({ id, attributes }) =>
        new MusicKit.MediaItem({
          id,
          attributes,
          type: 'song',
          container: {
            id
          }
        })
    );

    this.prependSongsToQueue({ items: mediaItems });

    this.showSnackbar({
      text: 'Item is playing next'
    });
  }

  onAddToQueue() {
    // this.$emit('add-to-queue');
    const songsToAdd = this.$_getSongsToAdd();

    const mediaItems = songsToAdd.map(
      ({ id, attributes }) =>
        new MusicKit.MediaItem({
          id,
          attributes,
          type: 'song',
          container: {
            id
          }
        })
    );

    try {
      // appendSongs is synchronous
      this.appendSongsToQueue({ items: mediaItems });
      this.showSnackbar({
        text: 'Item is added to queue'
      });
    } catch {
      this.showSnackbar({
        text: 'Something went wrong',
        type: SnackbarMode.error
      });
    }
  }

  $_getSongsToAdd(): Song[] {
    // song in queue
    if (
      !this.mediaActionMenu.item ||
      this.mediaActionMenu.item.type === 'song'
    ) {
      return [];
    }

    let songsToAdd: Song[] = [];
    if (
      this.mediaActionMenu.item.type === 'songs' ||
      this.mediaActionMenu.item.type === 'library-songs'
    ) {
      songsToAdd = [this.mediaActionMenu.item];
    } else {
      songsToAdd = getSongsFromCollection(this.mediaActionMenu.item);
    }
    return songsToAdd;
  }
}
</script>

<style lang="scss">
.media-menu-content .v-list__tile {
  font-size: 14px;
  height: 30px;
}
</style>
