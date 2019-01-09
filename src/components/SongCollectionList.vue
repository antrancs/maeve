<template>
  <v-layout row wrap>
    <v-flex
      xs6
      sm3
      md2
      class="pa-2"
      v-for="collection in collections"
      :key="collection.id"
    >
      <CollectionItemCard :collection="collection" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
/**
 * This component is used to display a collection of songs (playlist, album)
 */
import { Component, Prop, Vue } from 'vue-property-decorator';

// import SongCollectionItem from '@/components/SongCollectionItem.vue';
import CollectionItemCard from '@/components/CollectionItemCard.vue';
import { Collection } from '@/@types/model/model';

@Component({
  components: { CollectionItemCard }
})
export default class SongCollectionList extends Vue {
  @Prop({ default: () => [] })
  collections!: Collection[];
}
</script>
