<template>
  <div class="media-list">
    <SongCollectionItem
      v-for="collection in collections"
      :key="collection.id"
      :collection="collection"
    />
  </div>
</template>

<script lang="ts">
/**
 * This component is used to display a collection of songs (playlist, album)
 */
import { Component, Prop, Vue } from 'vue-property-decorator';

import SongCollectionItem from '@/components/SongCollectionItem.vue';
import { Collection } from '@/@types/model/model';

@Component({
  components: { SongCollectionItem }
})
export default class SongCollectionList extends Vue {
  @Prop({ default: () => [] })
  collections!: Collection[];
}
</script>

<style lang="scss" scoped></style>
