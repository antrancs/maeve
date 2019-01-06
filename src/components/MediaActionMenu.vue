<template>
  <v-menu
    bottom
    left
    offset-y
    v-model="songActionsMenu"
    :position-x="posX"
    :position-y="posY"
  >
    <slot slot="activator"></slot>
    <v-list class="primary lighten-1">
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

          <v-list class="primary lighten-1">
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

        <v-divider></v-divider>
      </template>

      <v-list-tile @click="onPlayNext">
        <v-list-tile-title>Play next</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="onAddToQueue">
        <v-list-tile-title>Add to queue</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Getter, State, Action } from 'vuex-class';
import { Nullable, Song, Collection, SnackbarMode } from '@/@types/model/model';
import {
  ADD_TO_LIBRARY,
  SHOW_SNACKBAR,
  PREPEND_SONGS,
  ADD_SONGS_TO_PLAYLIST,
  APPEND_SONGS
} from '@/store/actions.type';
import {
  AddToLibraryAction,
  ShowSnackbarAction,
  PrependSongsAction,
  AddSongsToPlaylistAction,
  AppendSongsAction
} from '@/store/types';
import { getSongsFromCollection } from '@/utils/utils';

@Component
export default class MediaActionMenu extends Vue {
  private songActionsMenu = false;
  private posX = 0;
  private posY = 0;
  private item: Nullable<Song | Collection> = null;
  // only songs have a container
  private container: Nullable<Collection> = null;

  @State(state => state.library.playlists)
  playlists!: MusicKit.LibraryPlaylist[];

  @Getter isAuthenticated!: boolean;

  @Action
  [ADD_TO_LIBRARY]: AddToLibraryAction;
  @Action [SHOW_SNACKBAR]: ShowSnackbarAction;
  @Action [PREPEND_SONGS]: PrependSongsAction;
  @Action [ADD_SONGS_TO_PLAYLIST]: AddSongsToPlaylistAction;
  @Action [APPEND_SONGS]: AppendSongsAction;

  get isLibraryItem() {
    if (!this.item) {
      return false;
    }
    return (
      this.item.type === 'library-songs' ||
      this.item.type === 'library-albums' ||
      this.item.type === 'library-playlists'
    );
  }

  get playlistId(): Nullable<string> {
    if (!this.item || this.item.type !== 'library-playlists') {
      return null;
    }
    return this.item.id;
  }

  get editablePlaylists() {
    // p.9oDKKQKhN4PaQp8
    return this.playlists.filter(playlist => {
      const containerIsCurrentPlaylist =
        this.container && this.container.id === playlist.id;
      return (
        playlist.id !== this.playlistId &&
        !containerIsCurrentPlaylist &&
        playlist.attributes &&
        playlist.attributes.canEdit
      );
    });
  }

  async onAddToLibrary() {
    if (!this.item) {
      return;
    }
    // this.$emit('add-to-library');

    try {
      await this.addToLibrary({
        itemIds: [this.item.id],
        type: this.item.type
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
    // this.$emit('add-to-new-playlist');
    const songsToAdd = this.$_getSongsToAdd();
    // @ts-ignore
    this.$root.$newPlaylistDialog.open(songsToAdd);
  }

  async onAddToExistingPlaylist(playlistId: string) {
    // this.$emit('add-to-existing-playlist', playlistId);
    this.songActionsMenu = false;
    const songsToAdd = this.$_getSongsToAdd();

    const songs = songsToAdd.map(({ id, type }) => ({
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

    this.prependSongs({ items: mediaItems });

    this.showSnackbar({
      text: 'Song is playing next'
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
      this.appendSongs({ items: mediaItems });
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

  open(
    item: Collection | Song,
    container: Nullable<Collection>,
    posX: number,
    posY: number
  ) {
    this.item = item;
    this.songActionsMenu = true;
    this.container = container;
    this.posX = posX;
    this.posY = posY;
  }

  $_getSongsToAdd(): Song[] {
    if (!this.item) {
      return [];
    }

    let songsToAdd: Song[] = [];
    if (this.item.type === 'songs' || this.item.type === 'library-songs') {
      songsToAdd = [this.item];
    } else {
      songsToAdd = getSongsFromCollection(this.item);
    }
    return songsToAdd;
  }
}
</script>
