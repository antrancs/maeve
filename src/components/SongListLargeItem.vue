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

      <v-flex :class="$style['middle-items']">
        <v-layout row wrap>
          <v-flex xs12 sm6 md5 class="pr-2">
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

          <v-flex xs12 md4 sm6 class="pr-2">
            <ResourceLinkList
              :class="['long-text-truncated', $style['artist-name']]"
              :resources="artists"
              :name="song.attributes.artistName"
            />
          </v-flex>

          <v-flex md3 class="hidden-sm-and-down">
            <div
              v-if="!isFromAlbum"
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
import ResourceLinkList from '@/components/ResourceLinkList.vue';
import SongItemMixin from '@/mixins/SongItemMixin';

@Component({
  components: { MediaArtworkOverlay, MediaArtwork, ResourceLinkList }
})
export default class SongListLargeItem extends Mixins(SongItemMixin) {
  @Prop({ default: true })
  isFromAlbum!: boolean;
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
