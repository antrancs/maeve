<template>
  <v-flex
    xs6
    sm3
    md2
    :class="{
      'pa-2': $vuetify.breakpoint.mdAndUp,
      'pa-1': $vuetify.breakpoint.mdAndDown
    }"
  >
    <router-link :to="{ name: artist.type, params: { id: artist.id } }">
      <v-card class="secondary elevation-8 item-card">
        <div class="pa-3">
          <MediaArtwork
            class="elevation-10"
            :artwork-url-for-artist="artistArtwork"
            :isRound="true"
          />
        </div>

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
  </v-flex>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getArtistArtwork } from '@/utils/utils';
import { Artist } from '@/@types/model/model';
import MediaArtwork from '@/components/MediaArtwork.vue';
import { Action } from 'vuex-class';
import { SHOW_SNACKBAR } from '@/store/actions.type';
import { ShowSnackbarAction } from '@/store/types';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';

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
    if (!url) {
      this.artistArtwork = PLACEHOLDER_IMAGE;
      return;
    }

    let artworkSize = 0;
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        artworkSize = 50;
        break;
      case 'sm':
        artworkSize = 100;
        break;
      case 'md':
        artworkSize = 150;
        break;
      default:
        artworkSize = 200;
    }

    getArtistArtwork(url, artworkSize, artworkSize)
      .then(artwork => {
        this.artistArtwork = artwork || PLACEHOLDER_IMAGE;
      })
      .catch(err => {
        this.showSnackbar({
          text: 'Something went wrong.'
        });
      });
  }
}
</script>
