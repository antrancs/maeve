<template>
  <div class="resource-link-list" :title="name">
    <template v-if="resources">
      <ResourceLinkItem
        v-for="(resource, index) in resources"
        :key="resource.id"
        :resource="resource"
        :text="names[index]"
      />
    </template>
    <template v-else>
      {{ name }}
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

import ResourceLinkItem from '@/components/ResourceLinkItem.vue';

/**
 * This component is used to display the link from one resrouce to another
 * For now, it's being used in SongItem component to display the link from a song to its artists and albums
 */
@Component({
  components: { ResourceLinkItem }
})
export default class ResourceLinkList extends Vue {
  @Prop() resources!: MusicKit.Album[] | MusicKit.Artist[];
  @Prop() name!: string;

  get names(): string[] {
    if (!this.resources) {
      return [];
    }

    if (this.resources.length === 1) {
      return [this.name];
    }
    return this.name.split(/ & |, /);
  }
}
</script>

<style lang="scss">
.resource-link-list :not(:last-child)::after {
  content: ', ';
}

.resource-link-list span a {
  display: inline-block;
}
</style>
