<template>
  <transition-group
    name="list"
    tag="div"
    class="layout row wrap section-offset"
  >
    <v-flex
      v-bind="itemSizeAttributes"
      class="px-2 pb-3"
      v-for="(collection, index) in collections"
      :key="`${collection.id}-${index}`"
    >
      <LinkComponent
        v-if="collection && collection.attributes"
        :routeName="collection.type"
        :routeParams="{ id: collection.id }"
      >
        <CollectionItemCard :collection="collection" />
      </LinkComponent>
    </v-flex>
  </transition-group>
</template>

<script lang="ts">
/**
 * This component is used to display a collection of songs (playlist, album)
 */
import { Component, Prop, Vue } from 'vue-property-decorator';

import CollectionItemCard from '@/components/Collection/CollectionItemCard.vue';
import { Collection } from '@/@types/model/model';
import LinkComponent from '@/components/LinkComponent.vue';

@Component({
  components: { CollectionItemCard, LinkComponent }
})
export default class SongCollectionList extends Vue {
  @Prop({ default: () => [] })
  collections!: Collection[];

  @Prop({ default: () => ['xs6', 'sm3', 'md3', 'lg2'] })
  itemSizes!: string[];

  get itemSizeAttributes() {
    const attrs = this.itemSizes.reduce((acc: any, current) => {
      acc[current] = true;
      return acc;
    }, {});

    return attrs;
  }
}
</script>
