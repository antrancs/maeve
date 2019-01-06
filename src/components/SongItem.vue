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
          'primary lighten-2': hover && isQueue,
          'py-1': $vuetify.breakpoint.xsOnly,
          'dark-mode': darkMode
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
                :title="song.attributes.name"
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

          <v-flex xs12 class="pr-2" :class="{ 'md4 sm6': !isQueue }">
            <ResourceLinkList
              :class="[
                'long-text-truncated',
                $style['artist-name'],
                { queue: isQueue }
              ]"
              :resources="artists"
              :name="song.attributes.artistName"
            />
          </v-flex>

          <v-flex md3 class="hidden-sm-and-down" v-if="!isQueue">
            <div
              v-if="!isFromAlbum && !isQueue"
              :class="['long-text-truncated', $style['album-name']]"
            >
              <span v-if="$vuetify.breakpoint.smAndDown"> - </span>
              <ResourceLinkList
                :resources="albums"
                :name="song.attributes.albumName"
              />
            </div>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-btn
        slot="activator"
        v-if="!isQueue"
        class="song-actions"
        :style="{ opacity: hover ? 1 : 0 }"
        icon
        @click.stop="onActionsIconClicked"
      >
        <v-icon>more_horiz</v-icon>
      </v-btn>

      <div :class="['sub-info-text', 'hidden-xs-only', $style['right-items']]">
        {{ song.attributes.durationInMillis | formattedDuration }}
      </div>
    </v-layout>
  </v-hover>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';

import { MusicPlayerState } from '@/store/types';
import { TOGGLE_CURRENT_TRACK } from '@/store/actions.type';
import {
  HandleSongClicked,
  Nullable,
  SnackbarMode,
  Song
} from '@/@types/model/model';
import MediaArtwork from '@/components/MediaArtwork.vue';
import MediaArtworkOverlay from '@/components/MediaArtworkOverlay.vue';
import ResourceLinkList from '@/components/ResourceLinkList.vue';

@Component({
  components: { MediaArtworkOverlay, MediaArtwork, ResourceLinkList }
})
export default class SongItem extends Vue {
  private showLoading = false;
  private songActionsMenuVisibility = false;

  @Prop()
  song!: Song;
  @Prop({ default: true })
  isFromAlbum!: boolean;
  @Prop()
  index!: number;
  @Prop({ default: false })
  isQueue!: boolean;

  @Getter darkMode!: boolean;

  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;

  @State
  musicPlayer!: MusicPlayerState;

  get isActive(): boolean {
    if (!this.musicPlayer.currentPlaying) {
      return false;
    }

    const currentPlayingId = this.musicPlayer.currentPlaying.id;

    const isMediaItemBeingPlayed =
      this.musicPlayer.currentPlaying.container !== undefined &&
      this.song.id === this.musicPlayer.currentPlaying.container.id;

    const isResourceBeingPlayed =
      this.song.attributes !== undefined &&
      this.song.attributes.playParams !== undefined &&
      this.song.attributes.playParams.catalogId === currentPlayingId;

    return (
      this.song.id === currentPlayingId ||
      isMediaItemBeingPlayed ||
      isResourceBeingPlayed // when a song is a library-song
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

  get artists(): Nullable<MusicKit.Artist[]> {
    // album songs shouldn't have relationships
    if (
      !this.song.relationships ||
      !this.song.relationships.artists ||
      this.song.type !== 'songs'
    ) {
      return null;
    }

    return this.song.relationships.artists.data;
  }

  get albums(): Nullable<MusicKit.Album[]> {
    if (
      !this.song.relationships ||
      !this.song.relationships.albums ||
      this.song.type !== 'songs'
    ) {
      return null;
    }
    return this.song.relationships.albums.data;
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
    this.$emit('song-item-clicked', this.song.id, this.index);
  }

  onActionsIconClicked(event: MouseEvent) {
    event.preventDefault();

    // this.$root.$mediaActionMenu.open(this.song, event.clientX, event.clientY);
    this.$emit('actions-icon-click', this.song, event.clientX, event.clientY);
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

.artist-name,
.album-name {
  color: var(--v-secondaryText-base);
}

.artist-name a,
.album-name a {
  color: var(--v-secondaryText-base);
}

.artist-name a:hover,
.album-name a:hover {
  color: var(--v-primaryText-base);
  text-decoration: underline;
}
</style>

<style lang="scss" scoped>
.song-item__wrapper {
  border-bottom: 0.1rem solid rgba(0, 0, 0, 0.08);
  // height: 5rem;
  transition: background-color 0.25s ease-in-out;

  &.dark-mode {
    border-bottom: 0.1rem solid rgba(255, 255, 255, 0.08);
  }
}
</style>
