<template>
  <v-hover>
    <v-layout
      row
      align-center
      v-if="song && song.attributes"
      @click.right.prevent="handleRightClick"
      :class="[
        'song-item__wrapper',
        {
          'song-item--playing': isActive,
          'primary lighten-1': hover,
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

      <slot></slot>

      <v-flex :class="$style['middle-items']">
        <v-layout row wrap align-center>
          <v-flex :class="isFromAlbum ? 'xs12' : 'lg6 xs12'">
            <v-layout row wrap>
              <v-flex xs12 :class="['pr-2', isFromAlbum ? 'lg6' : 'lg12']">
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

              <v-flex xs12 :class="['pr-2', isFromAlbum ? 'lg6' : 'lg12']">
                <div :class="['long-text-truncated']">
                  <span
                    :class="$style['artist-name']"
                    @click="$emit('go-to-artist-page', song)"
                    >{{ song.attributes.artistName }}</span
                  >
                </div>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex v-if="!isFromAlbum && $vuetify.breakpoint.lgAndUp" xs6>
            <div>
              <span v-if="$vuetify.breakpoint.smAndDown"> - </span>
              <div :class="['long-text-truncated']">
                <span
                  :class="$style['album-name']"
                  @click="$emit('go-to-album-page', song)"
                  >{{ song.attributes.albumName }}</span
                >
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-btn
        slot="activator"
        class="song-actions"
        :style="{ opacity: hover ? 1 : 0 }"
        icon
        @click.stop="onActionsIconClicked"
      >
        <v-icon>more_horiz</v-icon>
      </v-btn>

      <div
        :class="[
          'sub-info-text',
          'hidden-xs-only',
          $style['right-items'],
          'pr-2'
        ]"
      >
        {{ song.attributes.durationInMillis | formattedDuration }}
      </div>
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
import SongItemMixin from '@/mixins/SongItemMixin';

export default {
  name: 'SongListLargeItem',
  components: {
    MediaArtworkOverlay,
    MediaArtwork
  },
  props: {
    song: {
      type: Object,
      required: true
    }
  },
  mixins: [SongItemMixin]
};
</script>

<style lang="scss" module>
@import '@/styles/components/_song-list-item.scss';
</style>

<style lang="scss" scoped>
.song-item__wrapper {
  border-bottom: 0.1rem solid rgba(0, 0, 0, 0.08);
  height: 6rem;
  // line-height: 6rem;
  transition: background-color 0.25s ease-in-out;

  &.dark-mode {
    border-bottom: 0.1rem solid rgba(255, 255, 255, 0.08);
  }
}
</style>
