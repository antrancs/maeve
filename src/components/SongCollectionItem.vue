<template>
  <div v-if="collection && collection.attributes" class="media-column">
    <router-link :to="{ name: collection.type, params: { id: collection.id } }">
      <div class="artwork-wrapper">
        <!-- <img class="artwork" v-lazy="artworkUrl"> -->
        <media-artwork
          :artwork="this.collection.attributes.artwork"
          :width="300"
          :height="300"
        >
        </media-artwork>
        <div class="artwork-overlay" :class="artworkOverlayClass">
          <div @click.prevent="handleIconClicked">
            <icon
              v-if="isCollectionBeingPlayed && musicPlayer.isPlaying"
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
        <div class="long-text-truncated main-info-text">
          {{ collection.attributes.name }}
        </div>
        <icon
          class="explitcit-icon"
          v-if="collection.attributes.contentRating === 'explicit'"
          name="explicit"
        />
      </div>
      <div class="media-details__subtitle long-text-truncated sub-info-text">
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

import MediaArtwork from '@/components/MediaArtwork.vue';
import {
  PlayCollectionAtIndexPayload,
  PlayCollectionAtIndexAction
} from '@/store/types';
import { Collection, Nullable } from '@/@types/model/model';
import { MusicPlayerState } from '@/store/types';
import {
  PLAY_COLLECTION_AT_INDEX,
  TOGGLE_CURRENT_TRACK
} from '@/store/actions.type';

@Component({
  components: {
    MediaArtwork
  }
})
export default class SongCollectionItem extends Vue {
  // Props
  @Prop() collection!: Collection;

  // State
  @State musicPlayer!: MusicPlayerState;

  // Action
  @Action [PLAY_COLLECTION_AT_INDEX]: PlayCollectionAtIndexAction;
  @Action [TOGGLE_CURRENT_TRACK]!: () => void;

  // Computed
  get isCollectionBeingPlayed(): boolean {
    return (
      this.musicPlayer.currentPlaying !== null &&
      this.collection.id === this.musicPlayer.currentPlaying.container.id
    );
  }

  get artworkOverlayClass(): object {
    return {
      playing: this.isCollectionBeingPlayed
    };
  }

  // Methods
  handleIconClicked() {
    if (this.isCollectionBeingPlayed) {
      this.toggleCurrentTrack();
    } else {
      if (
        !this.collection ||
        !this.collection.attributes ||
        !this.collection.attributes.playParams
      ) {
        return;
      }

      this.playCollectionAtIndex({
        playParams: this.collection.attributes.playParams,
        index: 0
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.media-details {
  margin-top: $s-size;
}

.media-details__title {
  align-items: center;
  display: flex;
}

.media-details__subtitle {
  margin-top: $xs-size;
}
</style>
