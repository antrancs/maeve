<template>
  <div class="featured-playlist">
    <router-link :to="{ name: 'playlists', params: { id: playlist.id } }">
      <div class="featured-playlist__background" :style="backgroundStyle">
      </div>

      <div class="flex-column featured-playlist__content size-fit">
        <div class="flex-center featured-playlist__artwork-wrapper">
          <img :src="artworkUrl" alt="" class="featured-playlist__artwork" :style="artworkStyle">
          <div class="absolute-fit flex-center featured-playlist__description">
            {{ playlistLongDescription }}
          </div>
        </div>

        <div class="featured-playlist__info">
          <h5>PLAYLIST</h5>
          <h4>{{ playlist.attributes.name }}</h4>
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
  // Data
  // Props
  @Prop() playlist!: MusicKit.Playlist;

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
      'box-shadow': `3px 3px 10px #${
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

  // Life cycle methods
  created() {
    // console.log(this.playlist);
  }
}
</script>

<style lang="scss" scoped>
.featured-playlist {
  flex: 0 0 getColumnWidth(3);
  margin-right: $margin-column;
  max-width: getColumnWidth(3);
  height: 33rem;
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
  background-size: cover;
  bottom: 0;
  content: '';
  display: block;
  filter: blur(14px);
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.featured-playlist__content {
  justify-content: flex-end;
}

.featured-playlist__info {
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  flex: none;
  position: relative;
  height: 10rem;
}

.featured-playlist__artwork {
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
