<template>
  <div class="featured-playlist">
    <router-link :to="{ name: 'playlists', params: { id: playlist.id } }">
      <div class="featured-playlist__background" :style="backgroundStyle">
      </div>

      <div class="flex-column featured-playlist__content size-fit">
        <div class="flex-center featured-playlist__artwork-wrapper">
          <img
            v-lazy="artworkUrl"
            alt=""
            class="featured-playlist__artwork"
            :style="artworkStyle"
          >
          <div class="absolute-fit flex-center featured-playlist__description">
            {{ playlistLongDescription }}
          </div>
        </div>

        <div class="featured-playlist__info flex-row">
          {{ playlist.attributes.name }}
        </div>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getArtworkUrl } from '@/utils/utils';

@Component
export default class FeaturedPlaylist extends Vue {
  // Props
  @Prop()
  playlist!: MusicKit.Playlist;

  // Computed
  get artworkUrl(): string {
    if (
      !this.playlist ||
      !this.playlist.attributes ||
      !this.playlist.attributes.artwork
    ) {
      return '';
    }

    return getArtworkUrl(this.playlist.attributes.artwork.url, 400, 400);
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
    return {
      'box-shadow': `0.3rem 0.3rem 1rem #${
        this.playlist.attributes.artwork.textColor1
      }`
    };
  }

  get playlistLongDescription(): string {
    if (!this.playlist.attributes || !this.playlist.attributes.description) {
      return '';
    }
    return this.playlist.attributes.description.standard;
  }
}
</script>

<style lang="scss" scoped>
.featured-playlist {
  flex: 0 0 getColumnWidth(2);
  height: 20rem;
  margin-bottom: $m-size;
  margin-right: $margin-column;
  max-width: getColumnWidth(2);
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
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  flex: none;
  font-weight: bold;
  font-size: 1.4rem;
  height: 5rem;
  justify-content: center;
  padding: $m-size;
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

@media (min-width: $bp-phone) {
  .featured-playlist {
    flex: 0 0 getColumnWidth(3);
    height: 27rem;
    max-width: getColumnWidth(3);
  }

  .featured-playlist__info {
    height: 8rem;
  }

  .featured-playlist__artwork {
    max-width: 10rem;
  }

  .featured-playlist__info {
    font-size: 2rem;
  }
}

@media (min-width: $bp-desktop) {
  .featured-playlist {
    height: 33rem;
  }
}

@media (min-width: $bp-tablet-landscape) {
  .featured-playlist {
    flex: 0 0 getColumnWidth(4);
    max-width: getColumnWidth(4);
  }

  .featured-playlist__artwork {
    max-width: none;
  }
}
</style>
