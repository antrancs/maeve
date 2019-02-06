<template>
  <v-hover>
    <v-layout
      row
      align-center
      @click.right.prevent="handleRightClick"
      :class="[
        'song-item__wrapper',
        {
          'song-item--playing': isActive,
          'primary lighten-2': hover && !textColor && darkMode,
          'primary darken-2': hover && !textColor && !darkMode,
          'py-1': $vuetify.breakpoint.xsOnly,
          'dark-mode': darkMode
        }
      ]"
      slot-scope="{ hover }"
    >
      <template v-if="song && song.attributes">
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
              v-if="!isSongBlocked && !isArtistBlocked"
              :is-active="isActive"
              :is-playing="isPlaying"
              :show-background="!isFromAlbum"
              @playing-control-clicked="onSongClicked"
            />
          </div>
        </div>

        <div v-if="isChart" :style="chartIndex">{{ index + 1 }}</div>

        <v-flex :class="$style['middle-items']">
          <v-layout row wrap>
            <v-flex xs12 class="pr-2">
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
                  :color="textColor || ''"
                  v-if="song.attributes.contentRating === 'explicit'"
                  >explicit</v-icon
                >
              </v-layout>
            </v-flex>

            <v-flex xs12 class="pr-2">
              <ResourceLinkList
                :class="['long-text-truncated', $style['artist-name']]"
                :resources="artists"
                :name="song.attributes.artistName"
              />
            </v-flex>
          </v-layout>
        </v-flex>

        <v-btn
          v-if="!isQueue || isAuthenticated"
          slot="activator"
          class="song-actions"
          :style="{ opacity: hover ? 1 : 0 }"
          icon
          @click.stop="onActionsIconClicked"
        >
          <v-icon :color="textColor || undefined">more_horiz</v-icon>
        </v-btn>

        <div
          :style="rightItemWidthStyle"
          :class="['sub-info-text', 'hidden-xs-only', $style['right-items']]"
        >
          <template v-if="!hover || !isQueue">
            <template v-if="!isLastfm">
              {{ song.attributes.durationInMillis | formattedDuration }}
            </template>
            <template v-else>
              {{ lastfmStreamDate }}
            </template>
          </template>
          <template v-else>
            <v-icon
              v-if="!isActive"
              @click="$emit('remove-from-queue', index)"
              color="red"
              >remove_circle</v-icon
            >
          </template>
        </div>
      </template>

      <div v-else class="pa-2">Item not available</div>
    </v-layout>
  </v-hover>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Inject,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import { MusicPlayerState } from '@/store/types';
import { TOGGLE_CURRENT_TRACK } from '@/store/actions.type';
import {
  HandleSongClicked,
  Nullable,
  SnackbarMode,
  Song,
  LastfmSong
} from '@/@types/model/model';
import MediaArtwork from '@/components/MediaArtwork.vue';
import MediaArtworkOverlay from '@/components/MediaArtworkOverlay.vue';
import ResourceLinkList from '@/components/ResourceLinkList.vue';
import SongItemMixin from '@/mixins/SongItemMixin';

@Component({
  components: { MediaArtworkOverlay, MediaArtwork, ResourceLinkList }
})
export default class SongListSmallItem extends Mixins(SongItemMixin) {
  @Prop({ default: false })
  isQueue!: boolean;

  @Prop() textColor!: Nullable<string>;

  get songNameColor() {
    if (this.isSongBlocked || this.isArtistBlocked) {
      return this.$vuetify.theme.secondaryText;
    }
    return this.isActive
      ? this.$vuetify.theme.accent
      : this.textColor || this.$vuetify.theme.primaryText;
  }

  get chartIndex() {
    return {
      width: '3.2rem',
      'font-weight': 'bold',
      color: this.textColor || undefined
    };
  }

  get rightItemWidthStyle() {
    if (this.isLastfmSong(this.song)) {
      return {
        'flex-basis': '10rem'
      };
    }
    return {
      'flex-basis': '5rem'
    };
  }

  get isLastfm() {
    return this.isLastfmSong(this.song);
  }

  isLastfmSong(song: Song): song is LastfmSong {
    return (<LastfmSong>song).lastStream !== undefined;
  }

  get lastfmStreamDate(): Nullable<string> {
    if (this.isLastfmSong(this.song)) {
      return distanceInWordsToNow(Date.parse(this.song.lastStream + ' UTC'));
    }
    return null;
  }
}
</script>

<style lang="scss" module>
@import '@/styles/components/_song-list-item.scss';
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
