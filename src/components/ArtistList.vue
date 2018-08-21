<template>
  <div style="display: flex">
    <artist-item
      v-for="artist in artists"
      :key="artist.id"
      :artist="artist">
    </artist-item>
  </div>
</template>

<script>
import ArtistItem from './ArtistItem.vue';

export default {
  name: 'ArtistList',
  components: {
    ArtistItem
  },
  props: {
    artists: {
      type: Array,
      required: false
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
