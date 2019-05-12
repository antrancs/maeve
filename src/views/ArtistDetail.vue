<template>
  <v-container v-if="artist">
    <v-layout row wrap style="height: 100%">
      <v-flex xs12 lg5>
        <div
          :class="{
            'left-column-sticky': $vuetify.breakpoint.lgAndUp,
            'left-column': $vuetify.breakpoint.mdAndDown
          }"
        >
          <div class="banner-header pa-2" :style="bannerHeaderStyle">
            <h2 class="artist-name long-text-truncated">
              {{ artist.attributes.name }}
            </h2>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 lg7>
        <template v-if="featuredRelease">
          <section-header class="mx-2">{{
            featuredReleaseTitle
          }}</section-header>
          <v-flex xs6 sm3 md3 lg4 class="px-2">
            <LinkComponent
              :routeName="featuredRelease.type"
              :routeParams="{ id: featuredRelease.id }"
            >
              <CollectionItemCard :collection="featuredRelease" />
            </LinkComponent>
          </v-flex>
        </template>
        <template v-if="topSongs.length > 0">
          <v-flex xs12 :class="['px-2', { 'pt-4': featuredRelease }]">
            <section-header>Top Songs</section-header>
          </v-flex>
          <SongListSmall
            :songs="topSongs"
            :sourceInfo="{
              name: `${artist.attributes.name}'s top songs`,
              path: {
                name: 'artists',
                params: {
                  id
                }
              }
            }"
          />
        </template>

        <template v-if="albums.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>Albums</section-header>
          </v-flex>
          <SongCollectionList
            :itemSizes="['lg4', 'md3', 'sm3', 'xs6']"
            :collections="albums"
          />
        </template>

        <template v-if="singles.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>EPs & Singles</section-header>
          </v-flex>
          <SongCollectionList
            :itemSizes="['lg4', 'md3', 'sm3', 'xs6']"
            :collections="singles"
          />
        </template>

        <template v-if="artistPlaylists.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>Playlists</section-header>
          </v-flex>
          <SongCollectionList
            :itemSizes="['lg4', 'md3', 'sm3', 'xs6']"
            :collections="artistPlaylists"
          />
        </template>

        <template v-if="relatedArtists.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>Related artists</section-header>
          </v-flex>
          <ArtistList
            :artists="relatedArtists"
            :itemSizes="['lg3', 'md3', 'sm3', 'xs6']"
          />
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import musicApiService from '@/services/musicApi.service';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';
import SongListSmall from '@/components/Song/SongListSmall.vue';
import LinkComponent from '@/components/LinkComponent.vue';
import ArtistList from '@/components/ArtistList.vue';
import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import CollectionItemCard from '@/components/Collection/CollectionItemCard.vue';
import { formatArtworkUrl } from '@/utils/utils';
import {
  Nullable,
  Album,
  Artist,
  Playlist,
  Collection
} from '@/@types/model/model';
import { TEXT_PRIMARY_DARK } from '@/themes';

import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { getArtistDetails } from '../services/catalog.service';
import {
  FETCH_MULTILE_ALBUMS_CATALOG,
  FETCH_ONE_ALBUM_CATALOG,
  FETCH_MULTIPLE_PLAYLISTS_CATALOG,
  FETCH_MULTIPLE_SONGS_CATALOG,
  FETCH_MULTIPLE_ARTISTS_CATALOG
} from '../store/actions.type';
import {
  FetchMultipleAlbumsCatalogAction,
  FetchOneAlbumCatalogAction,
  FetchMultiplePlaylistsCatalogAction,
  FetchMultipleSongsCatalogAction,
  FetchMultipleArtitsCatalogAction
} from '../store/types';
import { Route } from 'vue-router';

@Component({
  components: {
    CollectionItemCard,
    SongCollectionList,
    SongListSmall,
    LinkComponent,
    ArtistList
  }
})
export default class ArtistDetail extends Mixins(DataLoadingMixin) {
  private artist: Nullable<Artist> = null;
  private albums: MusicKit.Album[] = [];
  private singles: MusicKit.Album[] = [];
  private relatedArtists: MusicKit.Artist[] = [];
  private artistPlaylists: MusicKit.Playlist[] = [];
  private featuredRelease: Nullable<MusicKit.Album> = null;
  private featuredReleaseTitle = '';
  private bannerUrl: Nullable<string> = null;
  private artworkUrl: Nullable<string> = PLACEHOLDER_IMAGE;
  private topSongs: MusicKit.Song[] = [];

  @Prop() id!: string;

  @Action [FETCH_MULTILE_ALBUMS_CATALOG]: FetchMultipleAlbumsCatalogAction;
  @Action [FETCH_ONE_ALBUM_CATALOG]: FetchOneAlbumCatalogAction;
  @Action
  [FETCH_MULTIPLE_PLAYLISTS_CATALOG]: FetchMultiplePlaylistsCatalogAction;
  @Action [FETCH_MULTIPLE_SONGS_CATALOG]: FetchMultipleSongsCatalogAction;
  @Action [FETCH_MULTIPLE_ARTISTS_CATALOG]: FetchMultipleArtitsCatalogAction;

  get bannerHeaderStyle() {
    if (!this.bannerUrl) {
      return {};
    }

    const style: any = {
      'background-image': `url('${this.bannerUrl}')`
    };

    if (this.$vuetify.breakpoint.name === 'md') {
      style.height = '50vh';
    } else if (this.$vuetify.breakpoint.name === 'sm') {
      style.height = '50vw';
    } else if (this.$vuetify.breakpoint.name === 'xs') {
      style.height = '80vw';
    }

    return style;
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.artist = null;
    this.featuredRelease = null;
    this.bannerUrl = null;
    this.artistPlaylists = [];
    this.topSongs = [];
    // this.bio = null;
    // this.birthday = null;
    // this.origin = null;
    this.albums = [];
    this.singles = [];
    this.relatedArtists = [];
    window.scrollTo(0, 0);
    this.$_getArtistInfo();
  }

  created() {
    this.$_getArtistInfo();
  }

  // Helper methods
  private $_getArtistInfo() {
    const artistId = this.id;

    musicApiService
      .getArtist(artistId)
      .then(artist => {
        this.artist = artist;
        this.$_getArtistDetails();
      })
      .catch(err => {
        // this.dataLoadingDone();
      });
  }

  private $_getArtistDetails() {
    if (!this.artist || !this.artist.attributes) {
      return;
    }

    if (this.artist.type === 'library-artists') {
      return;
    }

    getArtistDetails(
      this.artist.attributes.url,
      this.artist.id,
      this.$vuetify.breakpoint.name
    )
      .then((artistDetail: any) => {
        const {
          bannerUrl,
          artworkUrl,
          bio,
          birthday,
          relatedArtists,
          origin,
          topSongIds,
          artistPlaylists,
          feature,
          albums,
          singles
        } = artistDetail;

        this.bannerUrl = bannerUrl;

        this.artworkUrl = artworkUrl;
        // this.bio = bio;
        // this.birthday = birthday;
        // this.origin = origin;

        if (relatedArtists && relatedArtists.length > 0) {
          this.fetchMultipleArtistsCatalog(relatedArtists).then(artists => {
            this.relatedArtists = artists;
          });
        }

        if (topSongIds) {
          this.fetchMultipleSongsCatalog(topSongIds).then(songs => {
            // just get the first 5 songs
            this.topSongs = songs.slice(0, 5);
          });
        }

        if (artistPlaylists && artistPlaylists.length > 0) {
          this.fetchMultiplePlaylistsCatalog(artistPlaylists).then(
            playlists => {
              this.artistPlaylists = playlists;
            }
          );
        }

        if (feature && feature.id) {
          this.fetchOneAlbumCatalog(feature.id).then(album => {
            this.featuredRelease = album;
            this.featuredReleaseTitle = feature.title;
          });
        }

        if (albums && albums.length > 0) {
          this.fetchMultipleAlbumsCatalog(albums).then(albums => {
            this.albums = albums.slice(0, 6);
          });
        }

        if (singles && singles.length > 0) {
          this.fetchMultipleAlbumsCatalog(singles).then(singles => {
            this.singles = singles.slice(0, 6);
          });
        }
      })
      .finally(() => this.dataLoadingDone());
  }
}
</script>

<style lang="scss" scoped>
.left-column-sticky {
  height: calc(100vh - 64px - 24px - 16px);
  position: sticky;
  top: 88px;
}

.left-column-sticky .banner-header::before {
  background: linear-gradient(to right, transparent -5%, var(--v-primary-base)),
    linear-gradient(transparent 10%, var(--v-primary-base));
}

.left-column-sticky .banner-header {
  justify-content: center;
}

.left-column .banner-header {
  align-items: flex-end;
}

.left-column .banner-header::before {
  background: linear-gradient(transparent -30%, var(--v-primary-base));
}

.banner-header {
  width: 100%;
  height: 100%;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: row;
}

.banner-header::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.artist-name {
  font-size: 3.5rem;
  padding-top: 1rem;
  z-index: 1;
}
</style>
