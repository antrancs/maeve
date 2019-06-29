<template>
  <div class="pb-2">
    <div :class="$style['collection-name']">
      <h1
        :class="[$style['collection-title'], 'long-text-truncated']"
        :title="collectionName"
      >
        {{ collectionName }}
      </h1>
      <v-icon
        v-if="collection.attributes.contentRating === 'explicit'"
        dark
        size="22"
        class="ml-2"
        >explicit</v-icon
      >
    </div>

    <ResourceLinkList
      :resources="artists"
      :class="[$style['artist-name'], 'long-text-truncated']"
      :name="collectionArtistName"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

import ResourceLinkList from '@/components/ResourceLinkList.vue';
import { Collection, Nullable, Artist } from '../../@types/model/model';

@Component({
  components: {
    ResourceLinkList
  }
})
export default class CollectionDetail extends Vue {
  @Prop() collection!: Collection;
  @Prop() collectionArtistName!: string;

  get collectionName() {
    if (!this.collection || !this.collection.attributes) {
      return '';
    }

    return this.collection.attributes.name;
  }

  get artists(): Nullable<Artist[]> {
    if (
      this.collection &&
      this.collection.type === 'albums' &&
      this.collection.relationships &&
      this.collection.relationships.artists
    ) {
      return this.collection.relationships.artists.data;
    }

    return null;
  }
}
</script>

<style lang="scss" module>
.collection-name {
  display: flex;
}

.collection-title {
  font-weight: bold;
  color: white;
  font-size: 3rem;
  margin: 0;
}

.artist-name {
  color: white;
  font-size: 2rem;
  overflow: hidden;
}

.artist-name a {
  color: white;
}

@media (max-width: $md-breakpoint - 1) {
  .collection-title {
    font-size: 2.5rem;
  }

  .artist-name {
    font-size: 1.6rem;
  }
}
</style>
