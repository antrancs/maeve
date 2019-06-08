<template>
  <div :class="$style['wrapper']">
    <div :class="$style['carousel']" ref="scroll">
      <div
        :style="cardWidthStyle"
        style="flex: none;"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

import LinkComponent from '@/components/LinkComponent.vue';
import CollectionItemCard from './CollectionItemCard.vue';
import { Collection } from '@/@types/model/model';
import { setTimeout } from 'timers';
import {
  VUETIFY_LG_MAX_WIDTH,
  VUETIFY_XL_MAX_WIDTH
} from '../../utils/constants';

@Component({
  components: {
    CollectionItemCard,
    LinkComponent
  }
})
export default class CollectionCarousel extends Vue {
  @Prop({ default: () => [] })
  collections!: Collection[];

  get numOfVisibleItems() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xl':
      case 'lg':
        return 6; // there are 6 visible items to display in large screens

      case 'md':
        return 4; // there are 4 visible items to display in medium screens

      case 'sm':
        return 3; // there are 3 visible items to display in small screens

      default:
        return 2; // small screens
    }
  }

  get cardWidthStyle() {
    let width = 160;
    const marginRight = 16;
    const padding = 24;
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        width = 160;
        break;
      case 'sm':
        width = 180;
        break;
      case 'md':
        width = 200;
        break;
      case 'lg':
        width =
          (VUETIFY_LG_MAX_WIDTH -
            padding * 2 -
            marginRight * (this.numOfVisibleItems - 1)) /
          this.numOfVisibleItems;
        break;
      case 'xl':
        width =
          (VUETIFY_XL_MAX_WIDTH -
            padding * 2 -
            marginRight * (this.numOfVisibleItems - 1)) /
          this.numOfVisibleItems;
        break;
    }
    return {
      width: `${width}px`
    };
  }
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.carousel {
  display: flex;
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel > :not(:last-child) {
  margin-right: 1.6rem;
}

.carousel > :last-child {
  margin-right: 0;
}

.carousel::-webkit-scrollbar {
  display: none;
}
</style>
