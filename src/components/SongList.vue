<template>
  <div>
    <song-item
      :key="song.id"
      v-for="song in songs"
      :song="song"
      :collection-type="collectionType"
    >
    </song-item>
  </div>
</template>

<script>
import SongItem from './SongItem.vue';

export default {
  name: 'SongList',

  components: {
    SongItem
  },

  props: {
    collectionType: {
      type: String
    },

    songs: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
