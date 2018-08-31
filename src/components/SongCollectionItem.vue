<template>
  <div class="media-item">
    <router-link :to="{ name: 'album', params: { id: collection.id }}">
      <div class="media-item__artwork">
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
.media-item__artwork {
  align-items: flex-start;
  display: flex;
  position: relative;
  width: 100%;

  &:hover {
    .artwork-overlay {
      opacity: 1;
    }
  }
}

.artwork {
  max-width: 260px;
  width: 100%;
  position: relative;
}

.artwork-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  bottom: 0;
  color: white;
  display: flex;
  justify-content: center;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.artwork-overlay__icon {
  height: 50px;
  width: auto;

  &:hover {
    height: 70px;
  }
}

@media (min-width: 480px) {
  .media-item {
    flex: 0 0 47%;
    margin-left: 2%;
  }
}

@media (min-width: 768px) {
  .media-item {
    flex: 0 0 30.6666667%;
    margin-left: 2%;
  }
}

@media (min-width: 992px) {
  .media-item {
    flex: 0 0 22.5%;
    margin-left: 2%;
  }
}
</style>
