<template>
  <v-hover>
    <v-card class="secondary elevation-8 item-card" slot-scope="{ hover }">
      <MediaArtwork :artwork="artwork" :width="220" :height="220">
        <template v-if="hover || isCollectionBeingPlayed">
          <div class="overlay"></div>
          <v-btn
            icon
            round
            @click.prevent.stop="playCollection"
            color="accent elevation-5"
            class="play-button"
          >
            <v-icon v-if="isCollectionBeingPlayed && musicPlayer.isPlaying"
              >pause</v-icon
            >
            <v-icon v-else>play_arrow</v-icon>
          </v-btn>
        </template>
        <div class="top-icon pa-2"><slot></slot></div>
      </MediaArtwork>

      <v-card-title primary-title class="py-2 px-2">
        <div>
          <div class="media-details__title">
            <div
              class="long-text-truncated main-info-text card-text"
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
            class="long-text-truncated sub-info-text card-text"
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
import { Collection, Nullable } from '@/@types/model/model';
import { MusicPlayerState, PlayCollectionWithSongAction } from '@/store/types';
import {
  TOGGLE_CURRENT_TRACK,
  PLAY_COLLECTION_WITH_SONG
} from '@/store/actions.type';
import {
  isLight,
  TEXT_PRIMARY_LIGHT,
  TEXT_PRIMARY_DARK,
  TEXT_SECONDARY_LIGHT,
  TEXT_SECONDARY_DARK
} from '@/themes';

@Component({
  components: { MediaArtwork }
})
export default class CollectionItemCard extends Vue {
  @Prop()
  collection!: Collection;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [PLAY_COLLECTION_WITH_SONG]: PlayCollectionWithSongAction;
  @Action
  [TOGGLE_CURRENT_TRACK]!: () => void;

  get isCollectionBeingPlayed(): boolean {
    return this.$store.getters.isCollectionBeingPlayed(this.collection.id);
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

  playCollection() {
    this.playCollectionWithSong({
      collection: this.collection
    });
  }
}
</script>

<style lang="scss" scoped>
.overlay {
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

.top-icon {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
