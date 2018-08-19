<template>
  <div class="media-item" @click="play">
    <img class="media-item--artwork" :src="artworkUrl" alt="">
    <p class="media-info-title">{{collection.name}}</p>
    <p>{{collection.artistName || collection.curatorName}}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { PLAY_COLLECTION } from '@/store/actions.type';

export default {
  name: 'SongCollectionItem',

  props: {
    collection: {
      type: Object,
      required: false
    }
  },

  computed: {
    /**
     * Return a resized artwork for the collection.
     * TO-DO: Make this one a utility function that takes in a desired width & height
     * @returns {String}: Resized artwork URL
     */
    artworkUrl() {
      const { url } = this.collection.artwork;
      const replace = {
        '{w}': 500,
        '{h}': 500
      };

      return url.replace(/{w}|{h}/gi, matched => replace[matched]);
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
.media-item:hover {
  cursor: pointer;
}

.media-item--artwork {
  max-width: 200px;
  max-height: 200px;
}

.media-item {
  flex: 1;
}
</style>
