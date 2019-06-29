<template>
  <v-layout
    row
    align-center
    @click.right.prevent="handleRightClick"
    :class="[
      $style['wrapper'],
      {
        'py-1': $vuetify.breakpoint.xsOnly,
        [$style['unavailable']]: !isAvailable,
        [$style['active']]: isActive
      }
    ]"
  >
    <template v-if="song && song.attributes">
      <div
        @click.stop="onRowClicked"
        :class="['absolute-fit', $style['interactive-layer']]"
      ></div>
      <div
        :class="['ml-2', 'mr-3', $style['left-items']]"
        :style="leftItemsStyle"
      >
        <div v-if="fromAlbum" :class="[$style['track-number']]">
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

      <slot name="leftIndex"></slot>

      <v-flex :class="$style['middle-items']">
        <v-layout row wrap>
          <v-flex xs12 class="pr-2">
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

          <v-flex xs12 class="pr-2" v-if="!fromAlbum">
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
          'pr-2',
          'sub-info-text',
          'hidden-xs-only',
          $style['right-items']
        ]"
      >
        <slot name="rightIndex">
          <div style="flex-basis: 5rem">
            <slot name="hoverRightIndex">
              <template>
                {{ song.attributes.durationInMillis | formattedDuration }}
              </template>
            </slot>
          </div>
        </slot>
      </div>
    </template>

    <div v-else class="pa-2">Item not available</div>
  </v-layout>
</template>

<script lang="ts">
import SongItemMixin from '@/mixins/SongItemMixin';

export default {
  mixins: [SongItemMixin]
};
</script>

<style lang="scss" module>
@import '@/styles/components/_song-list-item.scss';
</style>
