<template>
  <div v-if="attributes" class="artist-detail">
    <div class="artist-detail-header">
      <div class="banner" :style="bannerStyle"></div>
      <div class="banner-overlay flex-column artist-banner-overlay">
        <h3 class="artist-name">{{ attributes.name }}</h3>
      </div>
    </div>

    <section class="content-spacing">
      <h3>Albums</h3>
      <song-collection-list :collections="nonSingles"></song-collection-list>
    </section>
    
    <section class="content-spacing">
      <h3>Singles</h3>
      <song-collection-list :collections="singles"></song-collection-list>
    </section>

    <section class="content-spacing">
      <h3>Playlists</h3>
      <song-collection-list :collections="playlists"></song-collection-list>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';
import { getArtistArtwork, formatArtworkUrl } from '@/utils/utils';
import { Nullable } from '@/@types/model/model';

@Component({
  components: { SongCollectionList }
})
export default class ArtistDetail extends Vue {
  // Data
  private attributes: Nullable<MusicKit.ArtistAttributes> = null;
  private artworkUrl: string = '';
  private albums: MusicKit.Album[] = [];
  private playlists: MusicKit.Playlist[] = [];

  // Life cycle methods
  created() {
    this.$_getArtistInfo();
  }

  // Computed
  get artworkLargeScreen(): string {
    return formatArtworkUrl(this.artworkUrl, 1000, 1000);
  }

  get artworkNormalScreen(): string {
    return formatArtworkUrl(this.artworkUrl, 800, 800);
  }

  get artworkTablet(): string {
    return formatArtworkUrl(this.artworkUrl, 540, 540);
  }

  get artworkPhone(): string {
    return formatArtworkUrl(this.artworkUrl, 400, 400);
  }

  get bannerStyle(): object {
    return {
      'background-image': `url('${this.artworkNormalScreen}')`,
      'background-position-y': '10%'
    };
  }

  get singles(): MusicKit.Album[] {
    return this.albums.filter(
      album => album.attributes && album.attributes.isSingle
    );
  }

  get nonSingles(): MusicKit.Album[] {
    return this.albums.filter(
      album => album.attributes && !album.attributes.isSingle
    );
  }

  // Helper methods
  private $_getArtistInfo() {
    const artistId = this.$route.params.id;
    musicApiService
      .getArtist(artistId)
      .then(({ attributes, albums, playlists }) => {
        this.attributes = attributes;
        this.$_getArtistArtwork();
        this.albums = albums;
        this.playlists = playlists;
      })
      .catch(err => {
        console.log(err);
      });
  }

  private $_getArtistArtwork() {
    if (!this.attributes) {
      return;
    }

    getArtistArtwork(this.attributes.url).then(artwork => {
      this.artworkUrl = artwork;
    });
  }
}
</script>

<style lang="scss" scoped>
.artist-detail {
  width: 100%;
}

.artist-detail-header {
  height: 55vh;
  position: relative;
}

.banner-overlay {
  background-color: rgba($color: (#000000), $alpha: 0.6);
  height: 100%;
  position: relative;
  z-index: 10;
}

.artist-banner-overlay {
  justify-content: flex-end;
}

.artist-name {
  font-size: $xl-font;
  margin: 0;
  padding: $m-size;
}
</style>

