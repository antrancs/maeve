<template>
  <v-layout row align-center align-content-space-between class="pb-2">
    <v-flex class="pr-2">
      <div :class="$style['collection-name']">
        <h1
          :class="[$style['collection-title'], 'long-text-truncated']"
          :title="collectionName"
        >
          {{ collectionName }}
        </h1>
        <v-icon
          v-if="collection.attributes.contentRating === 'explicit'"
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
    </v-flex>

    <ShareMenu
      v-if="collection.type === 'albums' || collection.type === 'playlists'"
      :appleMusicLink="collectionUrl"
      class="share-icon"
    />
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

import ShareMenu from '@/components/ShareMenu.vue';
import ResourceLinkList from '@/components/ResourceLinkList.vue';
import { Collection, Nullable, Artist } from '../../@types/model/model';

@Component({
  components: {
    ResourceLinkList,
    ShareMenu
  }
})
export default class CollectionInfo extends Vue {
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

  get collectionUrl() {
    if (!this.collection || !this.collection.attributes) {
      return null;
    }

    return this.collection.attributes.url;
  }
}
</script>

<style lang="scss" module>
.collection-name {
  display: flex;
}

.collection-title {
  font-weight: bold;
  font-size: 3rem;
  margin: 0;
}

.artist-name {
  font-size: 2rem;
  overflow: hidden;
}

.artist-name a {
  color: var(--v-secondaryText-base);
}

.artist-name a:hover {
  color: var(--v-primaryText-base);
}

@media (max-width: $md-breakpoint - 1) {
  .collection-title {
    font-size: 2.5rem;
  }

  .artist-name {
    font-size: 1.6rem;
  }
}

.share-icon {
  flex-shrink: 0;
}
</style>
