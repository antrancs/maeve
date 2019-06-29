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
            @keydown.stop=""
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="handleClose">Close</v-btn>
        <v-btn flat @click="handleSave">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action, State } from 'vuex-class';
import { Prop, Component } from 'vue-property-decorator';

import {
  CREATE_NEW_PLAYLIST,
  SHOW_SNACKBAR,
  CLOSE_NEW_PLAYLIST_DIALOG
} from '@/store/actions.type';
import { CreateNewPlaylistAction, ShowSnackbarAction } from '@/store/types';
import { SnackbarMode, Nullable, Song } from '@/@types/model/model';

@Component
export default class NewPlaylistDialog extends Vue {
  private dialog = true;
  private form = false;
  private name = '';
  private description = '';

  private rules = {
    name: (value: string) =>
      (value && value.trim().length > 0) || 'A name must be provided'
  };

  @State(state => state.newPlaylistDialog.itemsToAdd)
  itemsToAdd: (Song | MusicKit.MediaItem)[] | undefined;

  @Action [CREATE_NEW_PLAYLIST]: CreateNewPlaylistAction;
  @Action [SHOW_SNACKBAR]: ShowSnackbarAction;
  @Action [CLOSE_NEW_PLAYLIST_DIALOG]: () => void;

  async handleSave() {
    // @ts-ignore
    if (!this.$refs.form.validate()) {
      // there are input validation errors
      return;
    }

    this.dialog = false;

    try {
      await this.createNewPlaylist({
        name: this.name,
        items:
          this.itemsToAdd && this.itemsToAdd.length > 0
            ? this.itemsToAdd.map(item => ({
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
    } finally {
      this.closeNewPlaylistDialog();
    }

    this.name = '';
    this.description = '';
  }

  handleClose() {
    this.closeNewPlaylistDialog();
  }
}
</script>
