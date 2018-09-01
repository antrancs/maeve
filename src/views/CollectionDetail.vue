<template>
  <div>
    <div class="collection-detail-header">
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

    <song-list :songs="tracks" :collection-type="collectionType"></song-list>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { PLAY_COLLECTION } from '@/store/actions.type';
import SongList from '@/components/SongList.vue';
import { getArtworkUrl } from '@/utils/utils';
import musicApiService, { CollectionType } from '@/services/musicApi.service';

export default {
  name: 'CollectionDetail',

  components: {
    SongList
  },

  data() {
    return {
      collection: {},
      tracks: []
    };
  },

  computed: {
    collectionType() {
      return this.$route.path.startsWith('/albums')
        ? CollectionType.album
        : CollectionType.playlist;
    }
  },

  created() {
    const collectionId = this.$route.params.id;
    musicApiService
      .getCollection(collectionId, this.collectionType)
      .then(({ collection, tracks }) => {
        this.collection = collection;
        this.tracks = tracks;
      });
  },

  methods: {
    getArtworkUrl(artwork, width, height) {
      return artwork ? getArtworkUrl(artwork.url, width, height) : '';
    },

    play() {
      const { id, kind } = this.collection.playParams;

      this.playCollection({
        collectionId: id,
        collectionType: kind,
        atIndex: 0
      });
    },

    ...mapActions({
      playCollection: PLAY_COLLECTION
    })
  }
};
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
