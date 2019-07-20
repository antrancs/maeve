<template>
  <LinkComponent
    :routeName="collection.type"
    :routeParams="{ id: collection.id }"
  >
    <v-layout row wrap align-center class="list-item-wrapper">
      <img
        class="list-item-artwork ml-1"
        v-lazy="artworkUrl"
        :key="artworkUrl"
        :alt="`${collectionName} artwork`"
      />

      <v-flex class="collection-info-col">
        <v-layout row wrap>
          <v-flex xs12 sm12 md6 class="album-name long-text-truncated px-3">
            {{ collectionName }}
          </v-flex>

          <v-flex xs12 sm12 md6 class="artist-name px-3">{{
            artistName
          }}</v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </LinkComponent>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

import LinkComponent from '@/components/LinkComponent.vue';
import { PLACEHOLDER_IMAGE } from '../../../utils/constants';
import { getArtworkUrl } from '../../../utils/utils';

@Component({
  components: {
    LinkComponent
  }
})
export default class LibraryCollectionListItem extends Vue {
  @Prop() collection!: MusicKit.LibraryAlbum | MusicKit.LibraryPlaylist;

  get collectionName() {
    return this.collection.attributes ? this.collection.attributes.name : '';
  }

  get artistName() {
    return this.collection.attributes
      ? this.collection.attributes.artistName
      : '';
  }

  get artworkUrl(): string {
    if (!this.collection || !this.collection.attributes) {
      return PLACEHOLDER_IMAGE;
    }
    return getArtworkUrl(this.collection.attributes.artwork, 50, 50);
  }
}
</script>

<style lang="scss" scoped>
.list-item-wrapper {
  height: 60px;
}

.list-item-wrapper:hover {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.list-item-artwork {
  flex-basis: 5rem;
  width: 5rem;
  height: 5rem;
}

.album-name {
  font-size: 1.8rem;
  font-weight: bold;
}

.artist-name,
.album-name {
  color: var(--v-primaryText-base);
}

.collection-info-col {
  flex-basis: 0;
}
</style>
