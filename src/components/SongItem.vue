<template>
  <div class="song-item">
    <div class="song-item__left">
      <div class="index-column">
        <media-artwork
          v-if="!isFromAlbum"
          :artwork-url="artworkUrl"
        >
        </media-artwork>

        <media-artwork-overlay
          :show-background="!isFromAlbum"
          :is-active="isActive"
          :is-playing="isPlaying"
          @playingControlClicked="() => onSongItemClicked(index)"
        >
        </media-artwork-overlay>

        <div
          v-show="isFromAlbum && !isActive"
          class="track-number"
        >
          {{ track.attributes.trackNumber }}
        </div>
      </div>

      <div class="song-name long-text-truncated">
        {{ track.attributes.name }}
      </div>

      <icon
        class="explitcit-icon"
        v-if="track.attributes.contentRating === 'explicit'"
        name="explicit"
      />
    </div>

    <div class="song-item__middle">
      <div class="long-text-truncated song-item__artist-name">{{ track.attributes.artistName }}</div>
      <div
        v-if="shouldShowAlbumName"
        class="long-text-truncated song-item_album-name"
      >
        {{ track.attributes.albumName }}
      </div>
    </div>

    <div class="song-item__right">
      <div class="option">
        <icon class="icon" name="ellipsis-v"></icon>
      </div>
      <div>{{ track.attributes.durationInMillis | formatSongDuration }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import 'vue-awesome/icons/ellipsis-v';

import { MusicPlayerState } from '@/store/types';
import { getArtworkUrl } from '@/utils/utils';
import MediaArtwork from './MediaArtwork.vue';
import MediaArtworkOverlay from './MediaArtworkOverlay.vue';

@Component({
  components: { MediaArtworkOverlay, MediaArtwork },
  filters: {
    formatSongDuration(value: number) {
      if (!value) {
        return '0:00';
      }
      const durationInSeconds = Math.floor(value / 1000);
      const NUMBER_OF_SECONDS_IN_A_MINUTE = 60;
      const minutes = Math.trunc(
        durationInSeconds / NUMBER_OF_SECONDS_IN_A_MINUTE
      );
      const seconds = durationInSeconds % NUMBER_OF_SECONDS_IN_A_MINUTE;
      return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
    }
  }
})
export default class SongItem extends Vue {
  @Prop() track!: MusicKit.SongResource;
  @Prop({ default: true })
  shouldShowAlbumName!: boolean;
  @Prop({ default: true })
  isFromAlbum!: boolean;
  @Prop() index!: number;
  @Prop() onSongItemClicked!: (index: number) => void;

  @State musicPlayer!: MusicPlayerState;

  get isActive(): boolean {
    return (
      this.musicPlayer.currentPlaying !== null &&
      this.musicPlayer.currentPlaying.id === this.track.id
    );
  }

  get isPlaying(): boolean {
    return this.musicPlayer.isPlaying;
  }

  get artworkUrl(): string {
    return getArtworkUrl(this.track.attributes.artwork.url, 50, 50);
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_song-item.scss';

.artwork {
  max-width: 3.2rem;
}
</style>
