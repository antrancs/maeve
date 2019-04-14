<template>
  <router-link :to="{ name: 'playlists', params: { id: playlist.id } }">
    <div
      :class="['elevation-10', $style['wrapper']]"
      :style="featuredPlaylistStyle"
    >
      <div
        v-if="isJustUpdated"
        :class="[$style['just-updated-tag'], 'pa-1']"
        :style="justUpdatedTagStyle"
      >
        Just Updated
      </div>
      <div
        v-if="$vuetify.breakpoint.mdAndUp"
        :class="[$style['playlist-info'], 'pa-2']"
      >
        {{ playlistDescription }}
      </div>
      <div :class="[$style['bottom-sheet'], 'px-2']" :style="bottomSheetStyle">
        <div class="long-text-truncated">{{ playlist.attributes.name }}</div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

import {
  getArtworkUrl,
  getArtworkSize,
  hexToRgb,
  getTextColorForBackground
} from '@/utils/utils';
import { isLight } from '../../themes';

@Component
export default class FeaturedPlaylist extends Vue {
  @Prop()
  playlist!: MusicKit.Playlist;

  get artworkUrl(): string {
    if (
      !this.playlist ||
      !this.playlist.attributes ||
      !this.playlist.attributes.artwork
    ) {
      return '';
    }

    let width: number;
    let height: number;

    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        width = 250;
        height = 290;
        break;
      case 'sm':
        width = 280;
        height = 320;
        break;
      case 'md':
        width = 260;
        height = 300;
        break;
      case 'lg':
        width = 300;
        height = 350;
        break;

      default:
        width = 350;
        height = 400;
    }

    return this.playlist.attributes.artwork.url
      .replace('{w}', width.toString())
      .replace('{h}', height.toString())
      .replace('cc.jpeg', 'sr.jpeg')
      .replace('bb.jpeg', 'sr.jpeg');
  }

  get featuredPlaylistHeight() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return '21rem';
      case 'sm':
        return '28rem';
      case 'md':
        return '30rem';
      default:
        return '33rem';
    }
  }

  get featuredPlaylistStyle() {
    const artworkUrl = this.artworkUrl;
    return {
      height: this.featuredPlaylistHeight,
      'background-image': `url(${this.artworkUrl})`
    };
  }

  get bottomSheetStyle() {
    let bottomSheetBgColor = '';
    if (
      !this.playlist ||
      !this.playlist.attributes ||
      !this.playlist.attributes.artwork ||
      !this.playlist.attributes.artwork.textColor1 ||
      !this.playlist.attributes.artwork.bgColor
    ) {
      bottomSheetBgColor = '000000';
    } else {
      const { textColor1, bgColor } = this.playlist.attributes.artwork;

      bottomSheetBgColor = !isLight(bgColor) ? bgColor : textColor1;
    }

    const bgColorRgb = hexToRgb(bottomSheetBgColor);

    const style: any = {};
    style['background-color'] = `rgba(${bgColorRgb[0]},${bgColorRgb[1]}, ${
      bgColorRgb[2]
    }, 0.6)`;

    // Height
    let height = '7rem';
    if (this.$vuetify.breakpoint.name === 'xs') {
      height = '5rem';
      style['font-size'] = '1.7rem';
    }
    style['height'] = height;

    return style;
  }

  get playlistDescription(): string {
    if (!this.playlist.attributes || !this.playlist.attributes.description) {
      return '';
    }
    return (
      this.playlist.attributes.description.short ||
      this.playlist.attributes.description.standard
    );
  }

  get justUpdatedTagStyle() {
    const textColor = getTextColorForBackground(this.$vuetify.theme
      .accent as string);

    return {
      color: textColor,
      'background-color': this.$vuetify.theme.accent
    };
  }

  get isJustUpdated() {
    if (
      !this.playlist.attributes ||
      !this.playlist.attributes.lastModifiedDate
    ) {
      return false;
    }

    return (
      differenceInCalendarDays(
        new Date(),
        new Date(this.playlist.attributes.lastModifiedDate)
      ) <= 7
    );
  }
}
</script>

<style lang="scss" module>
$featured-playlist-border: 1.5rem;

.wrapper {
  justify-content: flex-end;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: $featured-playlist-border;
  display: flex;
  flex-direction: column;
  position: relative;
}

.wrapper:hover {
  .playlist-info {
    opacity: 1;
  }

  .just-updated-tag {
    opacity: 0;
  }
}

.playlist-info {
  align-items: center;
  background-color: rgba($color: #000000, $alpha: 0.4);
  color: white;
  display: flex;
  justify-content: center;
  flex-grow: 1;
  opacity: 0;
  transition: opacity 0.25s ease-in-out;
}

.bottom-sheet {
  align-items: center;
  border-bottom-left-radius: $featured-playlist-border;
  border-bottom-right-radius: $featured-playlist-border;
  color: white;
  display: flex;
  font-size: 2rem;
  font-weight: 600;
  height: 7rem;
  justify-content: center;
  width: 100%;
}

.just-updated-tag {
  color: white;
  font-size: 1.3rem;
  border-top-left-radius: 2rem;
  border-bottom-left-radius: 2rem;
  position: absolute;
  right: 0;
  top: 2rem;
  transition: opacity 0.25s ease-in;
}
</style>
