<template>
  <div v-if="artist" class="artist-detail" fluid>
    <div class="artist-detail-header">
      <div class="banner" :style="bannerStyle"></div>
      <div class="banner-overlay flex-column artist-banner-overlay">
        <v-container fill-height>
          <v-layout align-end>
            <h2 class="artist-detail__name">{{ artist.attributes.name }}</h2>
          </v-layout>
        </v-container>
      </div>
    </div>

    <v-container>
      <v-layout row wrap>
        <template v-if="nonSingles.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <h3 class="section-title">Albums</h3>
          </v-flex>

          <SongCollectionList :collections="nonSingles" />
        </template>

        <template v-if="artistType === 'library-artists'">
          <v-flex xs12 class="px-2 pt-4">
            <h3 class="section-title">Albums</h3>
          </v-flex>

          <SongCollectionList :collections="albums" />
        </template>

        <template v-if="singles.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <h3 class="section-title">Singles</h3>
          </v-flex>

          <SongCollectionList :collections="singles" />
        </template>

        <template v-if="playlists.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <h3 class="section-title">Playlists</h3>
          </v-flex>
          <SongCollectionList :collections="playlists" />
        </template>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';
import { getArtistArtwork, formatArtworkUrl } from '@/utils/utils';
import { Nullable, Album, Artist, Playlist } from '@/@types/model/model';
import { TEXT_PRIMARY_DARK } from '@/themes';
import { Action } from 'vuex-class';
import { FETCH_ONE_ARTIST_LIBRARY } from '@/store/actions.type';

@Component({
  components: { SongCollectionList }
})
export default class ArtistDetail extends Vue {
  private artist: Nullable<Artist> = null;
  // private attributes: Nullable<MusicKit.ArtistAttributes> = null;
  private artworkUrl: string = '';
  // private albums: Album[] = [];
  // private playlists: MusicKit.Playlist[] = [];

  @Action [FETCH_ONE_ARTIST_LIBRARY]!: (
    id: string
  ) => Promise<MusicKit.LibraryArtist>;

  created() {
    this.$_getArtistInfo();
  }

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
      'background-image': `url('${this.artworkNormalScreen}')`
    };
  }

  get headerOverlayTextStyle() {
    return {
      color: TEXT_PRIMARY_DARK
    };
  }

  get albums(): Album[] {
    if (
      !this.artist ||
      !this.artist.relationships ||
      !this.artist.relationships.albums
    ) {
      return [];
    }
    return this.artist.relationships.albums.data;
  }

  get playlists(): MusicKit.Playlist[] {
    if (
      !this.artist ||
      !this.artist.relationships ||
      !this.artist.relationships.albums
    ) {
      return [];
    }

    if (this.artist.type === 'library-artists') {
      return [];
    }

    return this.artist.relationships.playlists!.data;
  }

  get singles(): Album[] {
    if (!this.artist || this.artist.type === 'library-artists') {
      return [];
    }

    return this.albums.filter(
      album =>
        album.type === 'albums' && album.attributes && album.attributes.isSingle
    );
  }

  get nonSingles(): Album[] {
    return this.albums.filter(
      album =>
        album.type === 'albums' &&
        album.attributes &&
        !album.attributes.isSingle
    );
  }

  get artistType(): string {
    const path = this.$route.path;
    if (path.startsWith('/artists')) {
      return 'artists';
    }
    return 'library-artists';
  }

  // Helper methods
  private $_getArtistInfo() {
    const artistId = this.$route.params.id;
    if (this.artistType === 'artists') {
      musicApiService
        .getArtist(artistId)
        .then(artist => {
          // this.attributes = attributes;
          this.artist = artist;
          this.$_getArtistArtwork();
          //  this.albums = albums;
          //  this.playlists = playlists;
        })
        .catch(err => err);
    } else {
      this.fetchOneArtistLibrary(artistId).then(artist => {
        this.artist = artist;
      });
    }
  }

  // Helper methods
  private $_getArtistArtwork() {
    if (!this.artist || !this.artist.attributes) {
      return;
    }

    if (this.artist.type === 'library-artists') {
      return;
    }

    getArtistArtwork(this.artist.attributes.url).then(artwork => {
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
  background-color: rgba(
    $color: (
      #000000
    ),
    $alpha: 0.6
  );
  height: 100%;
  position: relative;
  z-index: 2;
}

.artist-banner-overlay {
  justify-content: flex-end;
}

.artist-detail__name {
  font-size: $xl-font;
}

.artist-detail__info {
  width: 100%;
}
</style>
