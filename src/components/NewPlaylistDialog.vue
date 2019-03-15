<template>
  <v-dialog max-width="600px" v-model="dialog" persistent>
    <slot slot="activator"></slot>

    <v-card class="primary">
      <v-card-title> <span class="headline">New Playlist</span> </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="form">
          <v-text-field
            v-model="name"
            color="accent"
            label="Name"
            :rules="[rules.name]"
            @keydown.stop=""
          ></v-text-field>

          <v-textarea
            name="playlist-description"
            label="Description"
            v-model="description"
            color="accent"
            auto-grow
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="dialog = false">Close</v-btn>
        <v-btn flat @click="handleSave">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Action } from 'vuex-class';
import { CREATE_NEW_PLAYLIST, SHOW_SNACKBAR } from '@/store/actions.type';
import { CreateNewPlaylistAction, ShowSnackbarAction } from '@/store/types';
import { SnackbarMode, Nullable, Song } from '@/@types/model/model';
import { Prop } from 'vue-property-decorator';

@Component
export default class NewPlaylistDialog extends Vue {
  private dialog = false;
  private form = false;
  private name = '';
  private description = '';
  private items: (Song | MusicKit.MediaItem)[] = [];

  private rules = {
    name: (value: string) =>
      (value && value.trim().length > 0) || 'A name must be provided'
  };

  @Action [CREATE_NEW_PLAYLIST]: CreateNewPlaylistAction;
  @Action [SHOW_SNACKBAR]: ShowSnackbarAction;

  async handleSave() {
    // there are input validation errors
    if (!this.form) {
      return;
    }

    this.dialog = false;

    try {
      await this.createNewPlaylist({
        name: this.name,
        items:
          this.items.length > 0
            ? this.items.map(item => ({
                id: item.id,
                type: item.type
              }))
            : undefined,
        description:
          this.description && this.description.trim().length > 0
            ? this.description
            : undefined
      });

      this.showSnackbar({
        text: 'The playlist has been created'
      });
    } catch {
      this.showSnackbar({
        text: 'Cannot create the playlist. Please try again later',
        type: SnackbarMode.error
      });
    }

    this.name = '';
    this.description = '';
    this.items = [];
  }

  open(items: Song[] | MusicKit.MediaItem[] = []) {
    this.items = items;
    this.name = '';
    this.description = '';
    this.dialog = true;
  }
}
</script>
