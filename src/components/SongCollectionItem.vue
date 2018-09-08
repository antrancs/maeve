<template>
  <div class="song-collection">
    <router-link :to="{ path: `${collection.type}/${collection.id}` }">
      <div class="artwork-wrapper">
        <img class="artwork" :src="artworkUrl" alt="">
        <div class="artwork-overlay" :class="artworkOverlayClass">
          <div @click.prevent="handleIconClicked">
            <icon v-if="isCollectionBeingPlayed && musicPlayer.isPlaying"
              class="artwork-overlay__icon"
              name="pause-circle"
            >
            </icon>
             <icon v-else
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
import { State, Action } from 'vuex-class';
import 'vue-awesome/icons/play-circle';
import 'vue-awesome/icons/pause-circle';
import Icon from 'vue-awesome/components/Icon.vue';

import { getArtworkUrl } from '@/utils/utils';
import { PlayCollectionAtIndexPayload } from '@/store/types';
import { Collection } from '@/@types/model/model';
import { MusicPlayerState } from '@/store/types';

@Component({
  components: { Icon }
})
export default class SongCollectionItem extends Vue {
  @Prop() collection!: Collection;
  @State musicPlayer!: MusicPlayerState;
  @Action
  playCollectionAtIndex!: (payload: PlayCollectionAtIndexPayload) => void;
  @Action toggleCurrentTrack!: () => void;

  get isCollectionBeingPlayed() {
    return (
      this.musicPlayer.currentPlaying &&
      this.collection.id === this.musicPlayer.currentPlaying.container.id
    );
  }
  get artworkOverlayClass() {
    return {
      playing: this.isCollectionBeingPlayed
    };
  }
  get artworkUrl() {
    return getArtworkUrl(this.collection.attributes.artwork.url, 500, 500);
  }

  handleIconClicked() {
    if (this.isCollectionBeingPlayed) {
      this.toggleCurrentTrack();
    } else {
      const { id, kind } = this.collection.attributes.playParams;

      this.playCollectionAtIndex({
        collectionId: id,
        collectionType: kind,
        index: 0
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_song-collection.scss';
@import '@/styles/components/_artwork.scss';
</style>
