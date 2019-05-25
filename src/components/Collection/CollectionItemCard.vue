<template>
  <v-hover>
    <v-card
      :tile="true"
      :class="['secondary', 'elevation-4', $style['item-card']]"
      slot-scope="{ hover }"
    >
      <MediaArtwork
        :artwork="artwork"
        :width="artworkSize"
        :height="artworkSize"
      >
        <template v-if="hover || isCollectionBeingPlayed">
          <div :class="$style['overlay']"></div>
          <div :class="$style['play-button']">
            <v-btn
              icon
              round
              @click.prevent.stop="onPlayButtonClicked"
              color="accent elevation-5"
            >
              <v-icon v-if="isCollectionBeingPlayed && musicPlayer.isPlaying"
                >pause</v-icon
              >
              <v-icon v-else>play_arrow</v-icon>
            </v-btn>
          </div>
        </template>
        <div :class="['pa-2', $style['top-icon']]">
          <slot></slot>
        </div>
      </MediaArtwork>

      <v-card-title primary-title class="py-2 px-2">
        <div>
          <div :class="$style['media-details__title']">
            <div
              :class="[
                'long-text-truncated',
                'main-info-text',
                $style['card-text']
              ]"
              :style="{ color: primaryTextSecondaryColor }"
              :title="collection.attributes.name"
            >
              {{ collection.attributes.name }}
            </div>
            <v-icon
              v-if="collection.attributes.contentRating === 'explicit'"
              class="ml-1"
              small
              >explicit</v-icon
            >
          </div>
          <div
            :class="[
              'long-text-truncated',
              'sub-info-text',
              $style['card-text']
            ]"
            :style="{ color: secondaryTextSecondaryColor }"
            :title="
              collection.attributes.artistName ||
                collection.attributes.curatorName
            "
          >
            {{
              collection.attributes.artistName ||
                collection.attributes.curatorName
            }}
          </div>
        </div>
      </v-card-title>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';

import MediaArtwork from '@/components/MediaArtwork.vue';
import { Collection, Nullable, Song } from '@/@types/model/model';
import { MusicPlayerState, PlayCollectionAction } from '@/store/types';
import {
  TOGGLE_CURRENT_TRACK,
  PAUSE_CURRENT_TRACK,
  PLAY_COLLECTION
} from '@/store/actions.type';
import {
  isLight,
  TEXT_PRIMARY_LIGHT,
  TEXT_PRIMARY_DARK,
  TEXT_SECONDARY_LIGHT,
  TEXT_SECONDARY_DARK
} from '@/themes';
import { getArtworkSize } from '@/utils/utils';

@Component({
  components: { MediaArtwork }
})
export default class CollectionItemCard extends Vue {
  @Prop()
  collection!: Collection;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;
  @Action [PAUSE_CURRENT_TRACK]: () => Promise<void>;
  @Action [PLAY_COLLECTION]: PlayCollectionAction;

  get isCollectionBeingPlayed(): boolean {
    if (
      !this.musicPlayer.currentPlaying ||
      !this.musicPlayer.currentPlaying.container
    ) {
      return false;
    }

    return this.musicPlayer.currentPlaying.container.id === this.collection.id;
  }

  get artworkSize() {
    return getArtworkSize(this.$vuetify.breakpoint.name);
  }

  get artworkOverlayClass(): object {
    return {
      playing: this.isCollectionBeingPlayed
    };
  }

  get artwork() {
    if (!this.collection || !this.collection.attributes) {
      return null;
    }
    return this.collection.attributes.artwork;
  }

  get primaryTextSecondaryColor() {
    return isLight(this.$vuetify.theme.secondary as string)
      ? TEXT_PRIMARY_LIGHT
      : TEXT_PRIMARY_DARK;
  }

  get secondaryTextSecondaryColor() {
    return isLight(this.$vuetify.theme.secondary as string)
      ? TEXT_SECONDARY_LIGHT
      : TEXT_SECONDARY_DARK;
  }

  async onPlayButtonClicked() {
    if (this.isCollectionBeingPlayed) {
      this.toggleCurrentTrack();
      return;
    }

    this.playCollection({
      collectionId: this.collection.id,
      collectionType: this.collection.type
    });

    // await this.pauseCurrentTrack();
  }
}
</script>

<style lang="scss" module>
@import '@/styles/components/_card.scss';

.item-card img {
  border-top-left-radius: $card-border-radius;
  border-top-right-radius: $card-border-radius;
}

.overlay {
  border-top-left-radius: $card-border-radius;
  border-top-right-radius: $card-border-radius;
  position: absolute;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  bottom: 0;
}

.play-button {
  position: absolute;
  bottom: 0;
  right: 0;
}

.media-details__title {
  align-items: center;
  display: flex;
}
</style>
