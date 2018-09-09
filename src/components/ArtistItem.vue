<template>
  <div class="media-column">
    <router-link :to="{ name: 'artist', params: { id: artist.id }}">
      <img :src="artistArtwork" alt="" class="artwork">
    </router-link>

    <h3>{{artist.attributes.name}}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getArtistArtwork } from '@/utils/utils';
import { Artist } from '@/@types/model/model';

@Component({})
export default class ArtistItem extends Vue {
  @Prop() artist!: MusicKit.ArtistResource;
  artistArtwork: string = '';

  created() {
    this.getArtistArtwork();
  }

  getArtistArtwork() {
    getArtistArtwork(this.artist.attributes.url).then(artwork => {
      this.artistArtwork =
        artwork.length > 0 ? artwork : 'https://via.placeholder.com/500x500';
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_artwork.scss';
</style>
