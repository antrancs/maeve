<template>
  <div v-if="track && track.attributes" class="song-item">
    <div class="song-item__left">
      <div v-if="showLoading" class="spinner">
      </div>
      <div v-else class="size-fit">
        <media-artwork
          v-if="!isFromAlbum"
          :artwork="track.attributes.artwork"
          :width="50"
          :height="50"
        >
        </media-artwork>

        <media-artwork-overlay
          :is-active="isActive"
          :is-playing="isPlaying"
          :show-background="!isFromAlbum"
          @playing-control-clicked="onSongClicked"
        >
        </media-artwork-overlay>

        <div
          v-if="isFromAlbum && !isActive"
          class="track-number flex-center size-fit"
        >
          {{ track.attributes.trackNumber }}
        </div>
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
        v-if="!isFromAlbum && !isQueue"
        :class="['long-text-truncated', 'song-item__album-name']"
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
      {{ track.attributes.durationInMillis | formattedDuration }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import 'vue-awesome/icons/ellipsis-h';

import { MusicPlayerState } from '@/store/types';
import { TOGGLE_CURRENT_TRACK } from '@/store/actions.type';
import { HandleSongClicked, Nullable } from '@/@types/model/model';
import MediaArtwork from './MediaArtwork.vue';
import MediaArtworkOverlay from './MediaArtworkOverlay.vue';

@Component({
  components: { MediaArtworkOverlay, MediaArtwork }
})
export default class SongItem extends Vue {
  private showLoading = false;
  // Props
  @Prop() track!: MusicKit.Song;
  @Prop({ default: true })
  isFromAlbum!: boolean;
  @Prop() index!: number;
  @Prop({ default: false })
  isQueue!: boolean;

  // State
  @State musicPlayer!: MusicPlayerState;

  // Action
  @Action [TOGGLE_CURRENT_TRACK]: () => void;

  // Provide/Inject
  @Inject() handleSongClicked!: HandleSongClicked;

  // computed
  get isActive(): boolean {
    return (
      this.musicPlayer.currentPlaying !== null &&
      this.musicPlayer.currentPlaying.id === this.track.id
    );
  }

  get isPlaying(): boolean {
    return this.musicPlayer.isPlaying;
  }

  @Watch('musicPlayer.isLoading')
  onLoadingChanged(newValue: boolean) {
    if (!newValue) {
      this.showLoading = false;
    }
  }

  // Methods
  handleMoreIconClicked(event: MouseEvent) {
    // @ts-ignore
    this.$contextMenu.open('cm-song-list', event, {
      selectedTrack: this.track
    });
  }

  /**
   * Event handler when a song row is clicked
   */
  onSongClicked() {
    // Toggle the song if it's playing
    if (
      this.musicPlayer.currentPlaying &&
      this.musicPlayer.currentPlaying.id === this.track.id
    ) {
      this.toggleCurrentTrack();
      return;
    }

    this.showLoading = true;
    // Forward the song info to the provider method
    if (!this.handleSongClicked) {
      return;
    }
    this.handleSongClicked(this.index, this.track.id);
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_song-item.scss';
</style>
