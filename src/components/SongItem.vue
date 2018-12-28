<template>
  <v-hover>
    <v-layout
      row
      align-center
      v-if="song && song.attributes"
      :class="[
        'song-item',
        {
          'song-item--playing': isActive,
          'primary lighten-1': hover && !isQueue,
          'secondary lighten-1': hover && isQueue
        }
      ]"
      slot-scope="{ hover }"
    >
      <div class="song-item__left ml-2 mr-3">
        <div v-if="showLoading" class="spinner"></div>
        <div v-else class="size-fit">
          <MediaArtwork
            v-if="!isFromAlbum"
            :artwork="song.attributes.artwork"
            :width="50"
            :height="50"
          />

          <div
            v-if="isFromAlbum && !isActive"
            class="track-number flex-center size-fit"
            :style="{ opacity: hover ? 0 : 1 }"
          >
            {{ song.attributes.trackNumber }}
          </div>

          <MediaArtworkOverlay
            :is-active="isActive"
            :is-playing="isPlaying"
            :show-background="!isFromAlbum"
            @playing-control-clicked="onSongClicked"
          />
        </div>
      </div>

      <v-flex class="song-item__middle">
        <v-layout row wrap>
          <v-flex xs12 class="pr-2" :class="{ 'sm6 md5': !isQueue }">
            <v-layout>
              <div class="long-text-truncated main-info-text">
                {{ song.attributes.name }}
              </div>

              <v-icon
                class="ml-1"
                small
                v-if="song.attributes.contentRating === 'explicit'"
                >explicit</v-icon
              >
            </v-layout>
          </v-flex>

          <v-flex xs12 class="pr-2" :class="{ 'md4 sm6': !isQueue }">
            <div
              :class="[
                'long-text-truncated',
                'song-item__artist-name',
                { queue: isQueue }
              ]"
            >
              {{ song.attributes.artistName }}
            </div>
          </v-flex>

          <v-flex md3 class="hidden-sm-and-down" v-if="!isQueue">
            <div
              v-if="!isFromAlbum && !isQueue"
              :class="['long-text-truncated', 'song-item__album-name']"
            >
              <span v-if="$vuetify.breakpoint.smAndDown"> - </span>
              {{ song.attributes.albumName }}
            </div>
          </v-flex>
        </v-layout>
      </v-flex>

      <div
        v-if="!isQueue"
        class="song-actions"
        :style="{ opacity: hover ? 1 : 0 }"
      >
        <v-menu bottom left>
          <v-btn slot="activator" icon dark>
            <v-icon @click.prevent.stop="">more_horiz</v-icon>
          </v-btn>

          <v-list>
            <v-list-tile @click="$emit('play-next', song)">
              <v-list-tile-title>Play next</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="$emit('add-to-queue', song)">
              <v-list-tile-title>Add to queue</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="$emit('add-to-library', song)">
              <v-list-tile-title>Add to library</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>

      <div class="song-item__right sub-info-text hidden-xs-only">
        {{ song.attributes.durationInMillis | formattedDuration }}
      </div>
    </v-layout>
  </v-hover>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';

import { MusicPlayerState } from '@/store/types';
import { TOGGLE_CURRENT_TRACK } from '@/store/actions.type';
import { HandleSongClicked, Nullable } from '@/@types/model/model';
import MediaArtwork from '@/components/MediaArtwork.vue';
import MediaArtworkOverlay from '@/components/MediaArtworkOverlay.vue';

@Component({
  components: { MediaArtworkOverlay, MediaArtwork }
})
export default class SongItem extends Vue {
  private showLoading = false;
  // Props
  @Prop()
  song!: MusicKit.Song;
  @Prop({ default: true })
  isFromAlbum!: boolean;
  @Prop()
  index!: number;
  @Prop({ default: false })
  isQueue!: boolean;

  // State
  @State
  musicPlayer!: MusicPlayerState;

  // Action
  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;

  // Provide/Inject
  @Inject()
  onSongItemClicked!: HandleSongClicked;

  // computed
  get isActive(): boolean {
    return (
      this.musicPlayer.currentPlaying !== null &&
      this.musicPlayer.currentPlaying.id === this.song.id
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

  /**
   * Event handler when a song row is clicked
   */
  onSongClicked() {
    // Toggle the song if it's playing
    if (
      this.musicPlayer.currentPlaying &&
      this.musicPlayer.currentPlaying.id === this.song.id
    ) {
      this.toggleCurrentTrack();
      return;
    }

    this.showLoading = true;

    // Forward the song info to the provider method
    if (!this.onSongItemClicked) {
      return;
    }
    this.onSongItemClicked(this.index, this.song.id);
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_song-item.scss';
</style>
