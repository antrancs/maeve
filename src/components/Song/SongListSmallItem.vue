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
              v-if="!fromAlbum"
              :artwork="song.attributes.artwork"
              :width="40"
              :height="40"
            />

            <div
              v-if="fromAlbum && !isActive"
              class="track-number flex-center size-fit"
              :style="{ opacity: hover ? 0 : 1 }"
            >
              {{ song.attributes.trackNumber }}
            </div>

            <MediaArtworkOverlay
              :is-active="isActive"
              :is-playing="isMusicPlaying"
              :show-background="!fromAlbum"
              @playing-control-clicked="onSongClicked"
            />
          </div>
        </div>

        <slot name="leftIndex"></slot>

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

            <v-flex xs12 class="pr-2" v-if="!fromAlbum">
              <div :class="['long-text-truncated']">
                <span
                  :class="$style['artist-name']"
                  @click="() => goToArtistPage(song)"
                  >{{ song.attributes.artistName }}</span
                >
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
          <v-icon :color="textColor || undefined">more_horiz</v-icon>
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
              <slot name="hoverRightIndex" :hover="hover">
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
  </v-hover>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';

import { Nullable } from '@/@types/model/model';
import MediaArtwork from '@/components/MediaArtwork.vue';
import MediaArtworkOverlay from '@/components/MediaArtworkOverlay.vue';
import SongItemMixin from '@/mixins/SongItemMixin';
import GoToArtistPageMixin from '@/mixins/GoToArtistPageMixin';

@Component({
  components: { MediaArtworkOverlay, MediaArtwork }
})
export default class SongListSmallItem extends Mixins(
  SongItemMixin,
  GoToArtistPageMixin
) {
  @Prop() textColor!: Nullable<string>;

  get songNameColor() {
    return this.isActive
      ? this.$vuetify.theme.accent
      : this.textColor || this.$vuetify.theme.primaryText;
  }
}
</script>

<style lang="scss" module>
@import '@/styles/components/_song-list-item.scss';
</style>

<style lang="scss" scoped>
.song-item__wrapper {
  border-bottom: 0.1rem solid rgba(0, 0, 0, 0.08);
  height: 6rem;
  transition: background-color 0.25s ease-in-out;

  &.dark-mode {
    border-bottom: 0.1rem solid rgba(255, 255, 255, 0.08);
  }
}
</style>
