<template>
  <div class="media-column">
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

    <div class="media-details">
      <div class="media-details__title">
        <div class="long-text-truncated">
          {{ collection.attributes.name }}
        </div>
        <icon
          class="explitcit-icon"
          v-if="collection.attributes.contentRating === 'explicit'"
          name="explicit"
        />
      </div>
      <div class="media-details__subtitle">
        {{ collection.attributes.artistName || collection.attributes.curatorName }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import 'vue-awesome/icons/play-circle';
import 'vue-awesome/icons/pause-circle';

import { getArtworkUrl } from '@/utils/utils';
import { PlayCollectionAtIndexPayload } from '@/store/types';
import { Collection } from '@/@types/model/model';
import { MusicPlayerState } from '@/store/types';

@Component({})
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
@import '@/styles/components/_artwork.scss';

.media-details {
  margin-top: $s-size;
}

.media-details__title {
  align-items: center;
  display: flex;
}

.media-details__subtitle {
  color: $subtitle-color;
  margin-top: $xs-size;
}
</style>
