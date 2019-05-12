<template>
  <v-dialog max-width="600px" v-model="dialog">
    <slot slot="activator"></slot>

    <v-card class="primary">
      <v-card-title>
        <span class="headline"
          >Lyrics for {{ this.currentPlaying.attributes.name }} by
          {{ this.currentPlaying.attributes.artistName }}</span
        >
      </v-card-title>

      <v-card-text
        v-if="lyrics && lyrics.length > 0"
        style="white-space: pre-wrap;"
        class="pt-0"
      >
        {{ lyrics }}
      </v-card-text>

      <div class="text-xs-center pb-4" v-else>
        <v-progress-circular
          :width="3"
          color="accent"
          indeterminate
        ></v-progress-circular>
      </div>
    </v-card>
    <v-card> </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { State } from 'vuex-class';

import LyricsMixin from '@/mixins/LyricsMixin';
import { getLyrics } from '@/services/lyrics.service';
import { Watch } from 'vue-property-decorator';
import { Nullable } from '@/@types/model/model';

@Component
export default class LyricsDialog extends Mixins(LyricsMixin) {
  private dialog = false;

  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: MusicKit.MediaItem;

  @Watch('dialog')
  onDialogVisibilityChanged(newValue: boolean, oldValue: boolean) {
    if (newValue && this.currentPlaying.attributes) {
      this.loadingLyrics = true;
      this.fetchLyrics(
        this.currentPlaying.attributes.name,
        this.currentPlaying.attributes.artistName
      );
    } else {
      this.lyrics = '';
    }
  }

  @Watch('currentPlaying')
  onCurrentPlayingChanged(
    newValue: Nullable<MusicKit.MediaItem>,
    oldValue: Nullable<MusicKit.MediaItem>
  ) {
    if (newValue && this.dialog && this.currentPlaying.attributes) {
      this.lyrics = '';
      this.fetchLyrics(
        this.currentPlaying.attributes.name,
        this.currentPlaying.attributes.artistName
      );
    }
  }
}
</script>
