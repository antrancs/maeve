<template>
  <div>
    <router-link :to="{ name: 'artist', params: { id: artist.id }}">
      <img :src="artistArtwork" alt="" class="artist-item--artwork">
    </router-link>

    <h3>{{artist.name}}</h3>
  </div>
</template>

<script>
import { getArtistArtwork } from '@/utils/utils';

export default {
  name: 'ArtistItem',
  props: {
    artist: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      artistArtwork: ''
    };
  },

  created() {
    this.getArtistArtwork();
  },

  methods: {
    getArtistArtwork() {
      getArtistArtwork(this.artist.url).then(artwork => {
        this.artistArtwork = artwork;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.artist-item--artwork {
  width: 200px;
  height: 200px;
}
</style>
