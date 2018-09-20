<template>
  <div class="media-column">
    <router-link :to="{ name: 'artists', params: { id: artist.id }}">
      <img
        :src="artistArtwork"
        alt=""
        class="artwork"
      />
    </router-link>

    <h3>{{ artist.attributes.name }}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getArtistArtwork } from '@/utils/utils';
import { Artist } from '@/@types/model/model';

@Component
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
    getArtistArtwork(url).then(artwork => {
      this.artistArtwork = artwork
        ? artwork
        : 'https://via.placeholder.com/500x500';
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_artwork.scss';
</style>
