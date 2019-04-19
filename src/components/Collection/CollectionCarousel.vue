<template>
  <div :class="$style['wrapper']">
    <v-layout
      row
      @scroll="throttledScrollHandler"
      :class="$style['carousel']"
      ref="scroll"
    >
      <v-flex
        :style="cardWidthStyle"
        lg2
        grow
        class="pa-2"
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
    </v-layout>

    <div
      v-if="$vuetify.breakpoint.lgAndUp"
      :class="$style['arrow-right']"
      v-show="!scrollAtRight"
      @click="scrollRight"
    >
      <v-icon light>keyboard_arrow_right</v-icon>
    </div>

    <div
      v-if="$vuetify.breakpoint.lgAndUp"
      :class="$style['arrow-left']"
      v-show="!scrollAtLeft"
      @click="scrollLeft"
    >
      <v-icon light>keyboard_arrow_left</v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import throttle from 'lodash/throttle';

import LinkComponent from '@/components/LinkComponent.vue';
import CollectionItemCard from './CollectionItemCard.vue';
import { Collection } from '@/@types/model/model';
import { setTimeout } from 'timers';

@Component({
  components: {
    CollectionItemCard,
    LinkComponent
  }
})
export default class CollectionCarousel extends Vue {
  private throttledScrollHandler!: (event: Event) => void;
  private scrollAtLeft = true;
  private scrollAtRight = false;
  private scrollLeftMax = 0;
  private isEdge = false;

  @Prop({ default: () => [] })
  collections!: Collection[];

  get scrollOffsetPerItem() {
    const numOfItems = this.collections.length;

    return this.scrollLeftMax / this.numOfItemsToScroll;
  }

  get numOfItemsToScroll() {
    return this.collections.length - this.numOfVisibleItems;
  }

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
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return {
          width: '160px'
        };
      case 'sm':
        return {
          width: '180px'
        };
      case 'md':
        return {
          width: '200px'
        };
      default:
        return {};
    }
  }

  created() {
    this.isEdge = /Edge/.test(navigator.userAgent);
    this.throttledScrollHandler = throttle(this.handleScroll, 250);
  }

  mounted() {
    this.calculateScrollLeftMax();
  }

  handleScroll(event: any) {
    if (!event || !event.target) {
      return;
    }

    const { scrollLeft, clientWidth, scrollWidth } = event.target;

    this.scrollAtLeft = scrollLeft === 0;
    this.scrollAtRight = Math.abs(clientWidth + scrollLeft - scrollWidth) <= 1; // allow the offset to be 1

    if (this.scrollAtLeft || this.scrollAtRight) {
      event.preventDefault();
    }
  }

  scrollRight() {
    let { scrollLeft } = this.$refs.scroll as any;
    this.calculateScrollLeftMax();

    const leftScrolledItems = Math.round(scrollLeft / this.scrollOffsetPerItem);
    const scrollLeftNewPosition =
      this.scrollOffsetPerItem * (leftScrolledItems + this.numOfVisibleItems);

    const step = Math.round((scrollLeftNewPosition - scrollLeft) / 10);

    const scrollRightHelper = () => {
      if (Math.round(scrollLeft) >= scrollLeftNewPosition) {
        return;
      }
      scrollLeft += step;

      if (!this.isEdge) {
        // scrollTo is not supported on Edge
        // @ts-ignore
        this.$refs.scroll.scrollTo({
          left: scrollLeft
        });
      } else {
        // @ts-ignore
        this.$refs.scroll.scrollLeft = scrollLeft;
      }

      window.requestAnimationFrame(scrollRightHelper);
    };

    scrollRightHelper();
  }

  scrollLeft() {
    this.calculateScrollLeftMax();
    let { scrollLeft } = this.$refs.scroll as any;

    const leftScrolledItems = Math.round(scrollLeft / this.scrollOffsetPerItem);

    const scrollLeftNewPosition =
      this.scrollOffsetPerItem * (leftScrolledItems - this.numOfVisibleItems);

    // @ts-ignore
    // this.$refs.scroll.scrollTo({
    //   left:
    //     this.scrollOffsetPerItem * (leftScrolledItems - this.numOfVisibleItems),
    //   behavior: 'smooth'
    // });

    const step = (scrollLeft - scrollLeftNewPosition) / 10;

    const scrollLeftHelper = () => {
      if (Math.round(scrollLeft) < scrollLeftNewPosition) {
        return;
      }
      scrollLeft -= step;

      if (!this.isEdge) {
        // scrollTo is not supported on Edge
        // @ts-ignore
        this.$refs.scroll.scrollTo({
          left: scrollLeft
        });
      } else {
        // @ts-ignore
        this.$refs.scroll.scrollLeft = scrollLeft;
      }

      window.requestAnimationFrame(scrollLeftHelper);
    };

    scrollLeftHelper();
  }

  calculateScrollLeftMax() {
    if (!this.$refs.scroll) {
      return;
    }

    const { clientWidth, scrollWidth } = this.$refs.scroll as any;

    if (typeof clientWidth !== 'number' || typeof scrollWidth !== 'number') {
      return;
    }

    this.scrollLeftMax = scrollWidth - clientWidth;
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
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.arrow-right {
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  right: -12px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
}

.arrow-left {
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  left: -12px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
}
</style>
