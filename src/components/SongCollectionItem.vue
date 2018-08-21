<template>
  <div class="media-item">
    <router-link :to="{ name: 'album', params: { id: collection.id }}">
      <img class="media-item--artwork" :src="artworkUrl" alt="">
    </router-link>
    <p class="media-info-title">{{collection.name}}</p>
    <p>{{collection.artistName || collection.curatorName}}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { PLAY_COLLECTION } from '@/store/actions.type';
import { getArtworkUrl } from '@/utils/utils';

export default {
  name: 'SongCollectionItem',

  props: {
    collection: {
      type: Object,
      required: false
    }
  },

  computed: {
    artworkUrl() {
      return getArtworkUrl(this.collection.artwork.url, 500, 500);
    }
  },

  methods: {
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
.media-item--artwork {
  max-width: 200px;
  max-height: 200px;
}

.media-item {
  flex: 1;
}
</style>
