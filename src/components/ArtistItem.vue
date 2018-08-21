<template>
  <div>
    <img :src="artistArtwork" alt="" class="artist-item--artwork">
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

    // this.$music.api.artist(this.artist.id).then(artistResult => {
    //   console.log('artistResult', artistResult);
    // });
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
