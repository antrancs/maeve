<template>
  <div class="song-collection">
    <router-link :to="{ path: `${collection.type}/${collection.id}` }">
      <div class="artwork-wrapper">
        <img class="artwork" :src="artworkUrl" alt="">
        <div class="artwork-overlay">
          <div @click.prevent="play">
            <icon
              class="artwork-overlay__icon"
              name="play-circle"
            >
            </icon>
          </div>
        </div>
      </div>
    </router-link>

    <p class="media-item__info-title">{{collection.name}}</p>
    <p>{{collection.artistName || collection.curatorName}}</p>
  </div>
</template>

<script>
import 'vue-awesome/icons/play-circle';
import Icon from 'vue-awesome/components/Icon.vue';
import { mapActions } from 'vuex';

import { PLAY_COLLECTION } from '@/store/actions.type';
import { getArtworkUrl } from '@/utils/utils';

export default {
  name: 'SongCollectionItem',

  components: {
    Icon
  },

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
      const { id } = this.collection.playParams;

      this.playCollection({
        collectionId: id,
        collectionType: this.collection.type
      });
    },
    ...mapActions({
      playCollection: PLAY_COLLECTION
    })
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/components/_song-collection.scss';
@import '@/styles/components/_artwork.scss';
</style>
