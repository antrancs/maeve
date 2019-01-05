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
    <router-link :to="{ name: 'artists', params: { id: artist.id } }">
      <MediaArtwork :artwork-url-for-artist="artistArtwork" :is-round="true" />
    </router-link>

    <div
      class="long-text-truncated main-info-text artist-item__name text-xs-center"
    >
      {{ artist.attributes.name }}
    </div>
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

  created() {
    if (this.artist.attributes) {
      this.$_getArtistArtwork(this.artist.attributes.url);
    }
  }

  // Helper functions
  private $_getArtistArtwork(url: string) {
    getArtistArtwork(url, 300, 300)
      .then(artwork => {
        this.artistArtwork = artwork
          ? artwork
          : 'https://via.placeholder.com/300x300';
      })
      .catch(err => {
        this.showSnackbar({
          text: 'Something went wrong.'
        });
      });
  }
}
</script>
