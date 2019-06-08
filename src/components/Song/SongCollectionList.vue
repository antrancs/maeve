<template>
  <transition-group
    name="list"
    tag="div"
    class="layout row wrap section-offset"
  >
    <v-flex
      v-bind="itemSizeAttributes"
      class="px-2 mb-3"
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

  @Prop({ default: () => ['xs6', 'sm3', 'lg2'] })
  itemSizes!: string[];

  get itemSizeAttributes() {
    let hasXl = false;
    let hasMd = false;

    const attrs = this.itemSizes.reduce((acc: any, current) => {
      acc[current] = true;
      if (current.startsWith('xl')) {
        hasXl = true;
      } else if (current.startsWith('md')) {
        hasMd = true;
      }
      return acc;
    }, {});

    if (!hasMd) {
      attrs['md-5-col'] = true;
    }
    if (!hasXl) {
      attrs['xl-7-col'] = true;
    }
    return attrs;
  }
}
</script>
