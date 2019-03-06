<template>
  <div
    class="featured-playlist elevation-10"
    :style="{ height: featurePlaylistHeight }"
  >
    <router-link :to="{ name: 'playlists', params: { id: playlist.id } }">
      <div class="featured-playlist__background" :style="backgroundStyle"></div>

      <div class="flex-column featured-playlist__content size-fit">
        <div class="flex-center featured-playlist__artwork-wrapper">
          <img
            v-lazy="artworkUrl"
            alt
            class="featured-playlist__artwork"
            :style="artworkStyle"
          />
          <div
            class="absolute-fit flex-center featured-playlist__description hidden-sm-and-down"
          >
            {{ playlistDescription }}
          </div>
        </div>

        <div class="featured-playlist__info text-xs-center">
          <v-layout fill-height align-center justify-center class="ma-0">
            {{ playlist.attributes.name }}
          </v-layout>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getArtworkUrl, getArtworkSize } from '@/utils/utils';

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

    const artworkSize = getArtworkSize(this.$vuetify.breakpoint.name);
    return getArtworkUrl(
      this.playlist.attributes.artwork.url,
      artworkSize,
      artworkSize
    );
  }

  get featurePlaylistHeight() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return '20rem';
      default:
        return '33rem';
    }
  }

  get backgroundStyle(): object {
    return {
      'background-image': `url(${this.artworkUrl})`
    };
  }

  get artworkStyle(): object {
    if (!this.playlist.attributes || !this.playlist.attributes.artwork) {
      return {};
    }

    let maxWidth: number;
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        maxWidth = 10;
        break;
      case 'sm':
        maxWidth = 13;
        break;
      default:
        maxWidth = 15;
    }

    return {
      'box-shadow': `0.3rem 0.3rem 1rem #${
        this.playlist.attributes.artwork.textColor1
      }`,
      'max-width': `${maxWidth}rem`
    };
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
}
</script>

<style lang="scss" scoped>
.featured-playlist {
  overflow: hidden;
  position: relative;

  &:hover {
    .featured-playlist__description {
      opacity: 1;
    }

    .featured-playlist__artwork {
      transform: scale(1.1);
    }
  }
}

.featured-playlist__background {
  // background-color: black;
  background-size: cover;
  bottom: 0;
  content: '';
  display: block;
  filter: blur(1.4rem);
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  -webkit-transform: translateZ(0);
  -webkit-perspective: 1000;
  -webkit-backface-visibility: hidden;
}

.featured-playlist__content {
  justify-content: flex-end;
}

.featured-playlist__info {
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  font-weight: bold;
  font-size: 2rem;
  height: 6rem;
  position: relative;
}

.featured-playlist__artwork {
  max-width: 7.5rem;
  width: 50%;
  transition: transform 0.3s ease-in-out;
}

.featured-playlist__artwork-wrapper {
  flex: 1;
  position: relative;
  z-index: 1;
}

.featured-playlist__description {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: $regular-font;
  opacity: 0;
  padding: 1.6rem;
  transition: opacity 0.3s ease-in-out;
}
</style>
