<template>
  <v-hover>
    <v-layout
      row
      align-center
      v-if="song && song.attributes"
      :class="[
        'song-item__wrapper',
        {
          'song-item--playing': isActive,
          'primary lighten-1': hover && !isQueue,
          'secondary lighten-1': hover && isQueue
        }
      ]"
      slot-scope="{ hover }"
    >
      <div :class="['ml-2', 'mr-3', $style['left-items']]">
        <v-progress-circular
          v-if="showLoading"
          indeterminate
          color="accent"
        ></v-progress-circular>
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

      <v-flex :class="$style['middle-items']">
        <v-layout row wrap>
          <v-flex xs12 class="pr-2" :class="{ 'sm6 md5': !isQueue }">
            <v-layout>
              <div
                class="long-text-truncated main-info-text"
                :style="{ color: songNameColor }"
              >
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

          <v-flex
            xs12
            class="pr-2"
            :class="{ 'md4 sm6': !isQueue }"
            :style="{ color: songInfoColor }"
          >
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

          <v-flex
            md3
            class="hidden-sm-and-down"
            v-if="!isQueue"
            :style="{ color: songInfoColor }"
          >
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

      <v-menu
        bottom
        left
        v-if="!isQueue"
        class="song-actions"
        :style="{ opacity: hover ? 1 : 0 }"
      >
        <v-btn slot="activator" icon dark> <v-icon>more_horiz</v-icon> </v-btn>

        <v-list class="secondary">
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

      <div
        :class="['sub-info-text', 'hidden-xs-only', $style['right-items']]"
        :style="{ color: songInfoColor }"
      >
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

  @Prop()
  song!: MusicKit.Song;
  @Prop({ default: true })
  isFromAlbum!: boolean;
  @Prop()
  index!: number;
  @Prop({ default: false })
  isQueue!: boolean;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;

  @Inject()
  onSongItemClicked!: HandleSongClicked;

  get isActive(): boolean {
    return (
      this.musicPlayer.currentPlaying !== null &&
      this.musicPlayer.currentPlaying.id === this.song.id
    );
  }

  get isPlaying(): boolean {
    return this.musicPlayer.isPlaying;
  }

  get songNameColor() {
    return this.isActive
      ? this.$vuetify.theme.accent
      : this.$vuetify.theme.primaryText;
  }

  get songInfoColor() {
    return this.isActive
      ? this.$vuetify.theme.accent
      : this.$vuetify.theme.secondaryText;
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

<style lang="scss" module>
.left-items {
  border-radius: 0.2rem;
  height: 3.2rem;
  overflow: hidden;
  position: relative;
  width: 3.2rem;
}

.right-items {
  flex: 0 0 5rem;
}

.middle-items {
  flex-basis: 0;
}
</style>

<style lang="scss" scoped>
.song-item__wrapper {
  border-bottom: 0.1rem solid rgba(255, 255, 255, 0.08);
  height: 5rem;
  transition: background-color 0.25s ease-in-out;
}
</style>
