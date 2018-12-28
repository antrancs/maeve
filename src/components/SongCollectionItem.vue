<template>
  <v-flex
    xs6
    sm3
    md2
    v-if="collection && collection.attributes"
    :class="{
      'pa-2': $vuetify.breakpoint.mdAndUp,
      'pa-1': $vuetify.breakpoint.mdAndDown
    }"
  >
    <router-link :to="{ name: collection.type, params: { id: collection.id } }">
      <div class="collection-artwork-wrapper">
        <MediaArtwork
          :artwork="this.collection.attributes.artwork"
          :width="300"
          :height="300"
        />

        <div class="collection-artwork-overlay" :class="artworkOverlayClass">
          <button @click.prevent="playCollection" icon class="playing-button">
            <v-icon
              size="50"
              v-if="isCollectionBeingPlayed && musicPlayer.isPlaying"
              >pause_circle_filled</v-icon
            >
            <v-icon v-else size="50">play_circle_filled</v-icon>
          </button>
        </div>
      </div>
    </router-link>

    <div>
      <div class="media-details__title">
        <div class="long-text-truncated main-info-text">
          {{ collection.attributes.name }}
        </div>
        <v-icon
          v-if="collection.attributes.contentRating === 'explicit'"
          class="ml-1"
          small
          >explicit</v-icon
        >
      </div>
      <div class="long-text-truncated sub-info-text">
        {{
          collection.attributes.artistName || collection.attributes.curatorName
        }}
      </div>
    </div>
  </v-flex>
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

@Component({
  components: {
    MediaArtwork
  }
})
export default class SongCollectionItem extends Vue {
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

  playCollection() {
    this.playCollectionWithSong({
      collection: this.collection
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_collection-artwork.scss';

.media-details__title {
  align-items: center;
  display: flex;
}
</style>
