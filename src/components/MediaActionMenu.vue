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
        <v-list-tile v-if="!isFromLibrary" @click="onAddToLibrary">
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
              v-for="playlist in playlists"
              v-if="!playlistId || playlistId !== playlist.id"
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
import { Getter, State } from 'vuex-class';
import { Nullable } from '@/@types/model/model';

@Component
export default class MediaActionMenu extends Vue {
  @Prop({ default: false }) visibility!: boolean;
  @Prop() isFromLibrary!: boolean;
  @Prop({ default: 0 }) posX!: number;
  @Prop({ default: 0 }) posY!: number;
  @Prop({ default: null }) playlistId: Nullable<string>;

  @State(state => state.library.playlists)
  playlists!: MusicKit.LibraryPlaylist[];

  @Getter isAuthenticated!: boolean;
  get songActionsMenu() {
    return this.visibility;
  }

  set songActionsMenu(value: boolean) {
    this.$emit('action-menu-visibility-change', value);
  }

  onAddToLibrary() {
    this.$emit('add-to-library');
  }

  onAddToNewPlaylist() {
    this.$emit('add-to-new-playlist');
  }

  onAddToExistingPlaylist(playlistId: string) {
    this.$emit('add-to-existing-playlist', playlistId);
  }

  onPlayNext() {
    this.$emit('play-next');
  }

  onAddToQueue() {
    this.$emit('add-to-queue');
  }
}
</script>
