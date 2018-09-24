<template>
  <div class="media-column">
    <router-link :to="{ name: 'artists', params: { id: artist.id }}">
      <media-artwork
        :artwork-url-for-artist="artistArtwork"
        :is-round="true"
      >
      </media-artwork>
    </router-link>

    <h3>{{ artist.attributes.name }}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getArtistArtwork } from '@/utils/utils';
import { Artist } from '@/@types/model/model';
import MediaArtwork from './MediaArtwork.vue';

@Component({
  components: {
    MediaArtwork
  }
})
export default class ArtistItem extends Vue {
  // Data
  private artistArtwork: string = '';

  // Props
  @Prop() artist!: MusicKit.Artist;

  // Life cycle methods
  created() {
    if (this.artist.attributes) {
      this.$_getArtistArtwork(this.artist.attributes.url);
    }
  }

  // Helper functions
  private $_getArtistArtwork(url: string) {
    getArtistArtwork(url, 400, 400)
      .then(artwork => {
        this.artistArtwork = artwork
          ? artwork
          : 'https://via.placeholder.com/500x500';
      })
      .catch(err => {
        console.log(err);
        // @ts-ignore
        this.$toasted.global.error();
      });
  }
}
</script>

<style lang="scss" scoped>
</style>
