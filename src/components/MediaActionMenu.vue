<template>
  <v-menu
    bottom
    left
    offset-y
    v-model="songActionsMenu"
    absolute
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
      </template>

      <template v-if="!isQueue && !isSongBlocked && !isArtistBlocked">
        <v-divider></v-divider>
        <v-list-tile @click="onPlayNext">
          <v-list-tile-title>Play next</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="onAddToQueue">
          <v-list-tile-title>Add to queue</v-list-tile-title>
        </v-list-tile>
      </template>

      <template v-if="shouldShowBlockingOption">
        <v-divider></v-divider>
        <v-list-tile v-if="item.type !== 'song'" @click="onBlockArtistClicked">
          <v-list-tile-title>{{
            isArtistBlocked ? 'Unblock artists' : 'Block artists'
          }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="onBlockSongClicked">
          <v-list-tile-title>{{
            isSongBlocked ? 'Unblock song' : 'Block song'
          }}</v-list-tile-title>
        </v-list-tile>
      </template>
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
  ADD_SONGS_TO_PLAYLIST,
  BLOCK_ARTISTS,
  UNBLOCK_ARTISTS,
  BLOCK_SONG,
  UNBLOCK_SONG,
  PREPEND_SONGS_TO_QUEUE
} from '@/store/actions.type';
import {
  AddToLibraryAction,
  ShowSnackbarAction,
  PrependSongsAction,
  AddSongsToPlaylistAction,
  AppendSongsAction,
  BlockArtistsAction,
  UnblockArtistsAction,
  BlockSongAction,
  UnblockSongAction
} from '@/store/types';
import { getSongsFromCollection } from '@/utils/utils';

@Component
export default class MediaActionMenu extends Vue {
  private songActionsMenu = false;
  private posX = 0;
  private posY = 0;
  private isQueue = false;
  // we can add songs from album/playlist OR album/playlist OR item from the play queue
  private item: Nullable<Song | Collection | MusicKit.MediaItem> = null;
  // only songs have a container
  private containerId: Nullable<string> = null;

  @State(state => state.library.playlists)
  playlists!: MusicKit.LibraryPlaylist[];
  @State(state => state.settings.blockedArtists) blockedArtists!: {
    [id: string]: boolean;
  };
  @State(state => state.settings.blockedSongs) blockedSongs!: {
    [id: string]: boolean;
  };

  @Getter isAuthenticated!: boolean;

  @Action
  [ADD_TO_LIBRARY]: AddToLibraryAction;
  @Action [SHOW_SNACKBAR]: ShowSnackbarAction;
  @Action [PREPEND_SONGS_TO_QUEUE]: PrependSongsAction;
  // @Action [PREPEND_SONGS]: PrependSongsAction;
  @Action [ADD_SONGS_TO_PLAYLIST]: AddSongsToPlaylistAction;

  @Action appendSongsToQueue!: AppendSongsAction;
  // @Action [APPEND_SONGS]: AppendSongsAction;
  @Action [BLOCK_ARTISTS]: BlockArtistsAction;
  @Action [UNBLOCK_ARTISTS]: UnblockArtistsAction;
  @Action [BLOCK_SONG]: BlockSongAction;
  @Action [UNBLOCK_SONG]: UnblockSongAction;

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

  get shouldShowBlockingOption() {
    return (
      this.item && (this.item.type === 'songs' || this.item.type === 'song')
    );
  }

  get editablePlaylists() {
    return this.playlists.filter(playlist => {
      const containerIsCurrentPlaylist =
        this.containerId && this.containerId === playlist.id;
      return (
        playlist.id !== this.playlistId &&
        !containerIsCurrentPlaylist &&
        playlist.attributes &&
        playlist.attributes.canEdit
      );
    });
  }

  get isArtistBlocked(): boolean {
    if (!this.item) {
      return false;
    }

    if (this.item.type === 'songs') {
      if (this.item.relationships && this.item.relationships.artists) {
        for (const artist of this.item.relationships.artists.data) {
          if (!this.blockedArtists[artist.id]) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  get isSongBlocked(): boolean {
    if (!this.item) {
      return false;
    }

    return this.blockedSongs[this.item.id];
  }

  async onAddToLibrary() {
    if (!this.item) {
      return;
    }

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
    if (!this.item) {
      return;
    }

    let itemsToAdd: (Song | MusicKit.MediaItem)[] = [];
    if (this.item.type === 'song') {
      itemsToAdd = [this.item];
    } else {
      itemsToAdd = this.$_getSongsToAdd();
    }

    // @ts-ignore
    this.$root.$newPlaylistDialog.open(itemsToAdd);
  }

  async onAddToExistingPlaylist(playlistId: string) {
    this.songActionsMenu = false;
    if (!this.item) {
      return;
    }

    let itemsToAdd: (Song | MusicKit.MediaItem)[] = [];
    if (this.item.type === 'song') {
      itemsToAdd = [this.item];
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

    const queueSongs = songsToAdd.map(song => {
      return {
        qId: song.id + '-' + Date.now(),
        ...song
      };
    });

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

    this.prependSongsToQueue({ items: queueSongs });

    this.showSnackbar({
      text: 'Song is playing next'
    });
  }

  onAddToQueue() {
    // this.$emit('add-to-queue');
    const songsToAdd = this.$_getSongsToAdd();

    const queueSongs = songsToAdd.map(song => {
      return {
        qId: song.id + '-' + Date.now(),
        ...song
      };
    });

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
      this.appendSongsToQueue({ items: queueSongs });
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

  onBlockArtistClicked() {
    if (!this.item) {
      return;
    }

    if (this.item.type === 'songs') {
      // get artist relationship
      if (this.item.relationships && this.item.relationships.artists) {
        const artists = this.item.relationships.artists.data.map(
          artist => artist.id
        );

        if (!this.isArtistBlocked) {
          this.blockArtists(artists);
        } else {
          this.unblockArtists(artists);
        }
      }
    }
  }

  onBlockSongClicked() {
    if (!this.item) {
      return;
    }

    if (this.isSongBlocked) {
      this.unblockSong(this.item.id);
    } else {
      this.blockSong(this.item.id);
    }
  }

  open(
    item: Collection | Song,
    containerId: Nullable<string>,
    posX: number,
    posY: number,
    isQueue: boolean = false
  ) {
    this.songActionsMenu = false;
    this.item = item;

    this.containerId = containerId;
    this.posX = posX;
    this.posY = posY;
    this.isQueue = isQueue;

    this.$nextTick(() => {
      this.songActionsMenu = true;
    });
  }

  $_getSongsToAdd(): Song[] {
    // song in queue
    if (!this.item || this.item.type === 'song') {
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
