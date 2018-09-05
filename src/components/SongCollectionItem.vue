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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import 'vue-awesome/icons/play-circle';
import Icon from 'vue-awesome/components/Icon.vue';

import { getArtworkUrl } from '@/utils/utils';
import { PlayCollectionAtIndexPayload } from '@/store/types';

@Component({
  components: { Icon }
})
export default class SongCollectionItem extends Vue {
  @Prop() collection: any;
  @Action
  playCollectionAtIndex!: (payload: PlayCollectionAtIndexPayload) => void;

  get artworkUrl() {
    return getArtworkUrl(this.collection.artwork.url, 500, 500);
  }

  play() {
    const { id, kind } = this.collection.playParams;

    this.playCollectionAtIndex({
      collectionId: id,
      collectionType: kind,
      index: 2
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_song-collection.scss';
@import '@/styles/components/_artwork.scss';
</style>
