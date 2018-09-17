<template>
  <div class="song-item">
    <div class="song-item__left">
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

    <div class="song-item__middle">
      <div :class="['song-item__song-name', { queue: isQueue }]">
        <div class="long-text-truncated">
          {{ track.attributes.name }}
        </div>

        <icon
          class="explitcit-icon"
          v-if="track.attributes.contentRating === 'explicit'"
          name="explicit"
        />
      </div>

      <div :class="['long-text-truncated', 'song-item__artist-name', { queue: isQueue }]">{{ track.attributes.artistName }}</div>
      <div
        v-if="!isFromAlbum"
        :class="['long-text-truncated', 'song-item__album-name', { queue: isQueue }]"
      >
        {{ track.attributes.albumName }}
      </div>
    </div>

    <div class="song-item__menu" v-if="!isQueue">
      <span @click.prevent.stop="handleMoreIconClicked">
        <icon class="icon" name="ellipsis-h">
        </icon>
      </span>
    </div>

    <div class="song-item__right">
      {{ track.attributes.durationInMillis | formatSongDuration }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import 'vue-awesome/icons/ellipsis-h';

import { MusicPlayerState, ToggleContextMenuPayload } from '@/store/types';
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
  @Prop() track!: MusicKit.Song;
  @Prop({ default: true })
  isFromAlbum!: boolean;
  @Prop() index!: number;
  @Prop() onSongItemClicked!: (index: number) => void;
  @Prop({ default: false })
  isQueue!: boolean;

  @State musicPlayer!: MusicPlayerState;

  @Action toggleContextMenu!: (payload: ToggleContextMenuPayload) => void;

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
    const { attributes } = this.track;
    if (!attributes) {
      return '';
    }
    return getArtworkUrl(attributes.artwork.url, 50, 50);
  }

  handleMoreIconClicked(event: MouseEvent) {
    // this.$refs.contextMenu.show(event);

    const mediaItem = new MusicKit.MediaItem({
      id: this.track.id,
      attributes: this.track.attributes,
      type: 'song'
    });

    this.toggleContextMenu({
      pageX: event.pageX,
      pageY: event.pageY,
      selectedTrack: mediaItem
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_song-item.scss';

.artwork {
  max-width: 3.2rem;
}
</style>
