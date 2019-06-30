<template>
  <div
    :class="[
      $style['wrapper'],
      'elevation-10',
      { [$style['expand']]: showExpandView }
    ]"
    :style="cssProps"
    @click="showExpandView = !showExpandView"
    v-lazy:background-image="backgroundUrl"
  >
    <div :class="$style['bottom-sheet']"></div>

    <div :class="$style['album-header']" :style="albumHeaderStyle"></div>

    <div :class="$style['song-list-wrapper']">
      <SongListSmall
        v-if="showExpandView"
        :songs="songs"
        :fromAlbum="true"
        :onSongClicked="handleSongClicked"
      />
    </div>

    <div :class="[$style['artist-name'], 'long-text-truncated']">
      <router-link
        :class="$style['link']"
        @click.native="$event.stopImmediatePropagation()"
        :to="{
          name: 'artists',
          params: {
            id: release.ownerId
          }
        }"
      >
        {{ release.ownerName }}
      </router-link>
    </div>
    <img v-lazy="albumArtworkUrl" alt="" :class="$style['album-artwork']" />

    <div :class="[$style['album-name'], 'long-text-truncated']">
      <router-link
        :class="$style['link']"
        @click.native="$event.stopImmediatePropagation()"
        :to="{
          name: 'albums',
          params: {
            id: release.id
          }
        }"
      >
        {{ release.name }}
      </router-link>
    </div>

    <small
      :class="[
        $style['album-description'],
        { 'long-text-truncated': $vuetify.breakpoint.smAndDown }
      ]"
      v-html="release.description"
    ></small>

    <div :class="[$style['play-button']]">
      <v-btn
        dark
        @click.stop="playAlbum"
        title="Play"
        :disabled="!showExpandView"
        fab
        small
        color="accent"
        class="ma-0"
      >
        <v-icon>play_arrow</v-icon>
      </v-btn>
    </div>

    <div :class="$style['close-button']">
      <v-btn
        dark
        title="Close"
        icon
        class="ma-0"
        @click.stop="showExpandView = false"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action } from 'vuex-class';
import { Prop, Component } from 'vue-property-decorator';

import {
  FETCH_ONE_ALBUM_CATALOG,
  PLAY_COLLECTION
} from '../../store/actions.type';
import {
  FetchOneAlbumCatalogAction,
  PlayCollectionAction
} from '../../store/types';
import {
  getSongsFromCollection,
  getGradientBackgroundColorsFromArtwork
} from '../../utils/utils';

@Component({
  components: {
    SongListSmall: () => import('@/components/Song/SongListSmall.vue')
  }
})
export default class NewReleaseHome extends Vue {
  private songs: MusicKit.Song[] = [];
  private showExpandView = false;

  @Prop() release: any;

  @Action [FETCH_ONE_ALBUM_CATALOG]: FetchOneAlbumCatalogAction;
  @Action [PLAY_COLLECTION]: PlayCollectionAction;

  get backgroundUrl() {
    return this.release.cover
      .replace('{w}', this.cardWidth)
      .replace('{h}', this.cardHeight);
  }

  get cardWidth() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 270;
      case 'sm':
        return 330;
      case 'md':
        return 360;
      default:
        return 420;
    }
  }

  get cardHeight() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 180;
      case 'sm':
        return 240;
      case 'md':
        return 270;
      default:
        return 300;
    }
  }

  get cssProps() {
    let albumHeaderHeight = 80;

    const albumArtworkWidth = this.cardWidth / 6;
    const bottomSheetHeight = albumArtworkWidth + 8 * 2;
    const expandedHeight = albumHeaderHeight + this.cardWidth;
    const upperHeight = this.cardHeight - bottomSheetHeight;

    return {
      '--featured-release-card-width': `${this.cardWidth}px`,
      '--featured-release-card-height': `${this.cardHeight}px`,
      '--featured-release-card-expanded-height': `${expandedHeight}px`,
      '--album-artwork-width': `${albumArtworkWidth}px`,
      '--bottom-sheet-height': `${bottomSheetHeight}px`,
      '--album-header-height': `${albumHeaderHeight}px`,
      '--upper-height': `${upperHeight}px`
    };
  }

  get albumArtworkUrl() {
    // the image size can be a bit smaller than the card's width for faster loading
    return this.release.artwork.url
      .replace('{w}', this.cardWidth - 20)
      .replace('{h}', this.cardWidth - 20)
      .replace('{f}', 'jpeg');
  }

  get albumHeaderStyle() {
    const colorsForGradient = getGradientBackgroundColorsFromArtwork(
      this.release.artwork
    );
    return {
      background: `linear-gradient(45deg, ${colorsForGradient.join(',')})`
    };
  }

  async created() {
    const album = await this.fetchOneAlbumCatalog(this.release.id);

    this.songs = getSongsFromCollection(album) as MusicKit.Song[];
  }

  playAlbum() {
    this.playCollection({
      collectionId: this.release.id,
      collectionType: 'albums'
    });
  }

  handleSongClicked(songId: string, songIndex: number) {
    if (!this.release) {
      return;
    }

    this.playCollection({
      collectionId: this.release.id,
      collectionType: 'albums',
      startPosition: songIndex
    });
  }
}
</script>

<style lang="scss" module>
$padding-x: 8px;

.wrapper {
  border-radius: $featured-card-border-radius;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: var(--featured-release-card-width);
  height: var(--featured-release-card-height);
  flex-shrink: 0;

  background-size: cover;
  position: relative;
  // transition: height 0.1s ease;
  user-select: none;

  &.expand {
    .artist-name {
      font-weight: 400;
      transform: translateY(
          calc(
            var(--bottom-sheet-height) + var(--album-header-height) -
              var(--featured-release-card-expanded-height)
          )
        )
        scale(0.7);
      right: 50px;
    }

    .album-artwork {
      transform: translate(
          -16px,
          calc(var(--album-header-height) - 8px - var(--upper-height))
        )
        scale(6);
      border-bottom-left-radius: $featured-card-border-radius / 6;
      border-bottom-right-radius: $featured-card-border-radius / 6;
    }

    .album-name {
      transform: translate(
          calc(-#{$padding-x} - var(--album-artwork-width)),
          calc(4px - var(--upper-height))
        )
        scale(1.1);
    }

    .album-header,
    .song-list-wrapper {
      opacity: 1;
    }

    .bottom-sheet {
      display: none;
    }

    .play-button,
    .close-button {
      opacity: 1;
      transition: opacity 0.2s ease-out 0.4s;
    }

    .album-description {
      opacity: 0;
    }

    height: var(--featured-release-card-expanded-height);
  }
}

.wrapper::before {
  content: '';
  position: absolute;
  border-radius: $featured-card-border-radius;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($color: #000000, $alpha: 0.5);
}

.bottom-sheet {
  background-color: rgba($color: #000000, $alpha: 0.5);
  border-bottom-left-radius: $featured-card-border-radius;
  border-bottom-right-radius: $featured-card-border-radius;
  color: white;
  height: var(--bottom-sheet-height);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.artist-name {
  left: 16px;
  position: absolute;
  bottom: calc(var(--bottom-sheet-height));
  z-index: 1;
  font-weight: 600;
  font-size: 22px;
  right: $padding-x;

  & a {
    color: white;
  }
}

.album-artwork {
  left: 16px;
  height: var(--album-artwork-width);
  position: absolute;
  top: calc(var(--upper-height) + 8px);
  transform-origin: top left;
  transition: transform 0.4s ease-out; // , scale 0.4s ease-out;
  width: var(--album-artwork-width);
}

.album-name {
  font-weight: 500;
  font-size: 1.8rem;
  position: absolute;
  left: calc(var(--featured-release-card-width) / 6 + 16px + 8px);
  top: calc(var(--upper-height) + 6px);
  z-index: 1;
  right: $padding-x;
}

.album-description {
  position: absolute;
  left: calc(var(--featured-release-card-width) / 6 + 16px + 8px);
  top: calc(var(--upper-height) + 32px);
  opacity: 1;
  z-index: 1;
  transition: opacity 0.2s ease-out;
  right: $padding-x;
  color: rgba($color: #fff, $alpha: 0.8);
}

.link {
  color: white;
}

.link:hover {
  font-weight: 600;
  text-decoration: underline;
}

.artist-name,
.album-name {
  transform-origin: top left;
  transition: transform 0.4s ease-out, scale 0.4s ease-out;
}

.album-header {
  border-top-left-radius: $featured-card-border-radius;
  border-top-right-radius: $featured-card-border-radius;
  opacity: 0;
  transition: opacity 0.4s ease-out;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--album-header-height);
}

.song-list-wrapper {
  background-color: rgba($color: #000000, $alpha: 0.5);
  border-bottom-left-radius: $featured-card-border-radius;
  border-bottom-right-radius: $featured-card-border-radius;
  width: 100%;
  z-index: 1;
  opacity: 0;

  transition: opacity 0.4s ease-out 0.2s;
  overflow-y: scroll;
  position: absolute;
  top: var(--album-header-height);
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 24px;
}

.play-button {
  right: 10px;
  top: calc(var(--album-header-height) - 18px);
}

.close-button {
  top: 4px;
  right: 4px;
}

.close-button,
.play-button {
  opacity: 0;
  position: absolute;
  transition: opacity 0.1s ease-in;
  z-index: 1;
}
</style>
