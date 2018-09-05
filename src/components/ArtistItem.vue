<template>
  <div>
    <router-link :to="{ name: 'artist', params: { id: artist.id }}">
      <img :src="artistArtwork" alt="" class="artist-item__artwork">
    </router-link>

    <h3>{{artist.name}}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getArtistArtwork } from '@/utils/utils';

@Component({})
export default class ArtistItem extends Vue {
  @Prop() artist!: any;
  artistArtwork: string = '';

  created() {
    this.getArtistArtwork();
  }

  getArtistArtwork() {
    getArtistArtwork(this.artist.url).then(artwork => {
      this.artistArtwork = artwork;
    });
  }
}
</script>

<style lang="scss" scoped>
.artist-item__artwork {
  width: 200px;
  height: 200px;
}
</style>
