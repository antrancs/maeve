<template>
    <div class="media-list">
        <song-collection-item
          v-for="collection in collections"
          :key="collection.id"
          :collection="collection"
        >
        </song-collection-item>
    </div>
</template>

<script>
/**
 * This component is used to display a collection of songs (playlist, album)
 */

import SongCollectionItem from './SongCollectionItem.vue';

export default {
  name: 'SongCollectionList',
  props: {
    collections: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    }
  },
  components: {
    SongCollectionItem
  }
};
</script>

<style lang="scss" scoped>
.media-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>
