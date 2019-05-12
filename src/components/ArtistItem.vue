<template>
  <router-link :to="{ name: artist.type, params: { id: artist.id } }">
    <v-card class="secondary elevation-8 item-card">
      <div class="pa-3">
        <MediaArtwork
          class="elevation-10"
          :artwork-url-for-artist="artistArtwork"
          :isRound="true"
        />
      </div>

      <div class="top-icon pa-1"><slot></slot></div>

      <v-card-title primary-title class="py-2 px-2">
        <v-layout column wrap>
          <div
            class="long-text-truncated main-info-text artist-item__name text-xs-center"
            style="width: 100%"
          >
            {{ artist.attributes.name }}
          </div>

          <div class="sub-info-text text-xs-center">{{ artistGenre }}</div>
        </v-layout>
      </v-card-title>
    </v-card>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Artist, SnackbarMode } from '@/@types/model/model';
import MediaArtwork from '@/components/MediaArtwork.vue';
import { Action } from 'vuex-class';
import { SHOW_SNACKBAR } from '@/store/actions.type';
import { ShowSnackbarAction } from '@/store/types';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { getArtistArtwork } from '../services/catalog.service';

@Component({
  components: {
    MediaArtwork
  }
})
export default class ArtistItem extends Vue {
  private artistArtwork: string = '';

  @Prop()
  artist!: MusicKit.Artist;

  @Action [SHOW_SNACKBAR]: ShowSnackbarAction;

  get artistGenre() {
    if (
      !this.artist.attributes ||
      !this.artist.attributes.genreNames ||
      this.artist.attributes.genreNames.length === 0
    ) {
      return '';
    }
    return this.artist.attributes.genreNames[0];
  }

  created() {
    if (this.artist.attributes) {
      this.$_getArtistArtwork(this.artist.attributes.url);
    }
  }

  // Helper functions
  private $_getArtistArtwork(url: string) {
    this.artistArtwork = PLACEHOLDER_IMAGE;

    if (!url) {
      return;
    }

    getArtistArtwork(url, this.artist.id, this.$vuetify.breakpoint.name)
      .then(artwork => {
        this.artistArtwork = artwork || PLACEHOLDER_IMAGE;
      })
      .catch(err => err);
  }
}
</script>

<style lang="scss" scoped>
.top-icon {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
