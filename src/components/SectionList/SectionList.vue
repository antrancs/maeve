<template>
  <div style="width: 100%" v-if="listItems.length > 0">
    <VirtualList :pagemode="true" :size="60" :remain="15" :bench="60">
      <template v-for="(listItem, index) in listItems">
        <SectionGroupHeader
          v-if="listItem.isSectionHeader"
          :key="'header-' + index"
          :title="listItem.title"
        />
        <div v-else :key="'item-' + index">
          <slot :list-item="listItem"></slot>
        </div>
      </template>
    </VirtualList>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// @ts-ignore
import VirtualList from 'vue-virtual-scroll-list';
import { Component, Prop } from 'vue-property-decorator';

import SectionGroupHeader from '@/components/SectionList/SectionGroupHeader.vue';

@Component({
  components: {
    SectionGroupHeader,
    VirtualList
  }
})
export default class SectionList extends Vue {
  @Prop() sections!: {
    [key: string]: any[];
  };

  get listItems() {
    if (!this.sections) {
      return [];
    }
    const items: any[] = [];
    let count = 0;

    let sectionsKeys = Object.keys(this.sections).sort();

    for (const key of sectionsKeys) {
      items.push({
        isSectionHeader: true,
        title: key
      });
      items.push(...this.sections[key]);
    }

    return items;
  }
}
</script>
