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

<script lang="ts">
/**
 * This component is used to display a collection of songs (playlist, album)
 */
import { Component, Prop, Vue } from 'vue-property-decorator';

import SongCollectionItem from './SongCollectionItem.vue';
import { Collection } from '@/@types/model/model';

@Component({
  components: { SongCollectionItem }
})
export default class SongCollectionList extends Vue {
  @Prop() collections!: Collection[];
}
</script>

<style lang="scss" scoped>
.media-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
