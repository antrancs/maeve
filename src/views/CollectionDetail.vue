<template>
  <div>
    <div class="collection-detail-header" v-if="collection">
        <div class="content">
          <h2>{{ collection.name }}</h2>
          <h3>{{ collection.artistName || collection.curatorName }}</h3>
          <button @click="play">Play</button>
          <button>Shuffle </button>
        </div>
        <picture class="collection-detail-header__banner">
          <source
            media="(max-width: 540px)"
            :srcset="getArtworkUrl(collection.artwork, 540, 540)">

          <source
            media="(max-width: 817px)"
            :srcset="getArtworkUrl(collection.artwork, 817, 817)">

          <source
            media="(max-width: 1105px)"
            :srcset="getArtworkUrl(collection.artwork, 1105, 1105)">

          <img
            class="image"
            :src="getArtworkUrl(collection.artwork, 400, 400)"/>
        </picture>
    </div>

    <song-list
      :tracks="tracks"
      :collection="collection"
    >
    </song-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import SongList from '@/components/SongList.vue';
import { getArtworkUrl } from '@/utils/utils';
import musicApiService, { CollectionType } from '@/services/musicApi.service';
import { PlayCollectionAtIndexAction } from '@/store/types';
import { Collection } from '@/@types/model/model';

@Component({
  components: { SongList }
})
export default class CollectionDetail extends Vue {
  collection: Collection | null = null;
  tracks: MusicKit.SongResource[] = [];

  @Action playCollectionAtIndex!: PlayCollectionAtIndexAction;

  get collectionType() {
    return this.$route.path.startsWith('/albums')
      ? CollectionType.album
      : CollectionType.playlist;
  }

  get collectionId() {
    return this.$route.params.id;
  }

  created() {
    const collectionId = this.$route.params.id;
    musicApiService
      .getCollection(collectionId, this.collectionType)
      .then(({ collection, tracks }) => {
        this.collection = collection;
        this.tracks = tracks;
      });
  }
  getArtworkUrl(artwork: MusicKit.Artwork, width: number, height: number) {
    return artwork ? getArtworkUrl(artwork.url, width, height) : '';
  }

  play() {
    if (!this.collection) {
      return;
    }
    const { id, kind } = this.collection.attributes.playParams;

    this.playCollectionAtIndex({
      collectionId: id,
      collectionType: kind,
      index: 0
    });
  }

  handleSongItemClicked(index: number) {
    if (!this.collection) {
      return;
    }

    const { id, kind } = this.collection.attributes.playParams;

    this.playCollectionAtIndex({
      collectionId: id,
      collectionType: kind,
      index: index
    });
  }
}
</script>

<style lang="scss" scoped>
.collection-detail-header {
  height: 350px;
  position: relative;
}

.content {
  position: relative;
  z-index: 100;
  background-color: rgba($color: (#000000), $alpha: 0.4);
  color: white;
  height: 100%;
}

.collection-detail-header__banner {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
