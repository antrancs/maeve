<template>
  <v-hover>
    <v-layout
      row
      align-center
      v-if="song && song.attributes"
      @click.right.prevent="handleRightClick"
      :class="[
        $style['wrapper'],
        {
          'primary lighten-1': hover,
          'py-1': $vuetify.breakpoint.xsOnly,
          'dark-mode': darkMode,
          [$style['unavailable']]: !isAvailable,
          [$style['active']]: isActive
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
            v-if="!fromAlbum"
            :artwork="song.attributes.artwork"
            :width="40"
            :height="40"
          />

          <div
            v-if="fromAlbum && !isActive"
            class="track-number flex-center size-fit"
            :style="{ opacity: hover && isAvailable ? 0 : 1 }"
          >
            {{ song.attributes.trackNumber }}
          </div>

          <MediaArtworkOverlay
            v-if="(isAvailable && hover) || isActive"
            :isActive="isActive"
            :isPlaying="isMusicPlaying"
            :show-background="!fromAlbum"
            @playing-control-clicked="onSongClicked"
          />
        </div>
      </div>

      <slot></slot>

      <v-flex :class="$style['middle-items']">
        <v-layout row wrap align-center>
          <v-flex :class="fromAlbum ? 'xs12' : 'lg6 xs12'">
            <v-layout row wrap>
              <v-flex xs12 :class="['pr-2', fromAlbum ? 'lg6' : 'lg12']">
                <v-layout>
                  <div
                    :class="['long-text-truncated', $style['song-name']]"
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

              <v-flex xs12 :class="['pr-2', fromAlbum ? 'lg6' : 'lg12']">
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

          <v-flex v-if="!fromAlbum && $vuetify.breakpoint.lgAndUp" xs6>
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
