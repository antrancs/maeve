<template>
  <v-layout
    row
    align-center
    v-if="song && song.attributes"
    @click.right.prevent="handleRightClick"
    :class="[
      $style['wrapper'],
      {
        'py-1': $vuetify.breakpoint.xsOnly,
        'dark-mode': darkMode,
        [$style['unavailable']]: !isAvailable,
        [$style['active']]: isActive
      }
    ]"
  >
    <div
      @click.stop="onRowClicked"
      :class="['absolute-fit', $style['interactive-layer']]"
    ></div>
    <div
      :class="['ml-2', 'mr-3', $style['left-items']]"
      :style="leftItemsStyle"
    >
      <div
        v-if="fromAlbum && !isActive"
        :class="$style['track-number']"
        :style="leftItemsStyle"
      >
        {{ song.attributes.trackNumber }}
      </div>

      <div :class="$style['playing-control']">
        <button
          class="btn btn--icon"
          @mouseover="playingControlHovered = true"
          @mouseout="playingControlHovered = false"
          @click.stop="onSongClicked"
        >
          <v-icon color="white">{{ contentIcon }}</v-icon>
        </button>
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
      :class="$style['song-actions']"
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
</template>

<script lang="ts">
import SongItemMixin from '@/mixins/SongItemMixin';

export default {
  name: 'SongListLargeItem',
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
