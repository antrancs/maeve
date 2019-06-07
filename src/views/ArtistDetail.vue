<template>
  <v-container
    v-if="artist"
    :class="['py-0', { 'px-0': $vuetify.breakpoint.smAndDown }]"
  >
    <v-layout row wrap style="height: 100%">
      <v-flex xs12 lg5 :class="{ 'pl-2': $vuetify.breakpoint.lgAndUp }">
        <div
          :class="{
            [$style['left-column-sticky']]: $vuetify.breakpoint.lgAndUp,
            [$style['playing']]: currentPlaying,
            [$style['left-column']]: $vuetify.breakpoint.mdAndDown
          }"
        >
          <div :class="$style['banner-header']" :style="bannerHeaderStyle">
            <h1
              :class="[
                $style['artist-name'],
                'pa-2',
                'long-text-truncated',
                { 'px-3': $vuetify.breakpoint.smAndDown }
              ]"
            >
              {{ artist.attributes.name }}
            </h1>

            <nav
              v-if="$vuetify.breakpoint.lgAndUp"
              v-show="loadingDone"
              :class="['absolute-fit', 'pr-2', $style['nav']]"
            >
              <ul>
                <li
                  v-for="item in visibleNavigationItems"
                  :key="item.value"
                  :class="[
                    'mb-2',
                    $style['nav-item'],
                    { [$style['active']]: currentTab === item.value }
                  ]"
                  @click="currentTab = item.value"
                >
                  <span :class="[$style['nav-item-text'], 'pb-1']">{{
                    item.text
                  }}</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 lg7 :class="['pt-2', 'px-2']">
        <keep-alive>
          <component
            :is="currentTabComponent"
            v-bind="currentTabProps"
          ></component>
        </keep-alive>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import { Route } from 'vue-router';

import ArtistDetailOverview from '@/components/Artist/ArtistDetailOverview.vue';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';
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
import { SET_FOOTER_VISIBILITY } from '../store/mutations.type';
import { getArtist } from '../services/musicApi.service';

@Component({
  components: {
    ArtistDetailOverview,
    ArtistDetailAbout: () => import('@/components/Artist/ArtistDetailAbout.vue')
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
  private bio: Nullable<string> = null;
  private origin: Nullable<string> = null;
  private birthday: Nullable<string> = null;
  private loadingDone = false;
  private currentTab = 'overview';
  private navigationItems: {
    [id: string]: {
      value: string;
      component: string;
      text: string;
      shouldShow: boolean;
    };
  } = {
    overview: {
      text: 'Overview',
      value: 'overview',
      component: 'ArtistDetailOverview',
      shouldShow: true
    },
    about: {
      text: 'About',
      value: 'about',
      component: 'ArtistDetailAbout',
      shouldShow: true
    }
  };

  @Prop() id!: string;

  // used to adjust the height of the left column when there's a player bar
  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: MusicKit.MediaItem | null;

  @Action [FETCH_MULTILE_ALBUMS_CATALOG]: FetchMultipleAlbumsCatalogAction;
  @Action [FETCH_ONE_ALBUM_CATALOG]: FetchOneAlbumCatalogAction;
  @Action
  [FETCH_MULTIPLE_PLAYLISTS_CATALOG]: FetchMultiplePlaylistsCatalogAction;
  @Action [FETCH_MULTIPLE_SONGS_CATALOG]: FetchMultipleSongsCatalogAction;
  @Action [FETCH_MULTIPLE_ARTISTS_CATALOG]: FetchMultipleArtitsCatalogAction;
  @Mutation [SET_FOOTER_VISIBILITY]: (visibility: boolean) => void;

  get visibleNavigationItems() {
    return Object.values(this.navigationItems).filter(item => item.shouldShow);
  }

  get currentTabComponent(): string {
    return this.navigationItems[this.currentTab].component;
  }

  get currentTabProps() {
    if (this.currentTab === 'overview') {
      return {
        featuredRelease: this.featuredRelease,
        featuredReleaseTitle: this.featuredReleaseTitle,
        artistName: this.artist!.attributes!.name,
        artistId: this.artist!.id,
        artistPlaylists: this.artistPlaylists,
        relatedArtists: this.relatedArtists,
        singles: this.singles,
        albums: this.albums,
        topSongs: this.topSongs
      };
    }
    return {
      bio: this.bio,
      birthday: this.birthday,
      origin: this.origin
    };
  }

  get bannerHeaderStyle() {
    if (!this.bannerUrl) {
      return {};
    }

    const style: any = {};

    switch (this.$vuetify.breakpoint.name) {
      case 'md':
        style.height = '50vh';
        break;
      case 'sm':
        style.height = '50vw';
        break;
      case 'xs':
        style.height = '80vw';
    }

    style['background-image'] = `url('${this.bannerUrl}')`;

    return style;
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.artist = null;
    this.featuredRelease = null;
    this.bannerUrl = null;
    this.artistPlaylists = [];
    this.topSongs = [];
    this.bio = null;
    this.birthday = null;
    this.origin = null;
    this.albums = [];
    this.singles = [];
    this.relatedArtists = [];
    this.loadingDone = false;
    window.scrollTo(0, 0);
    this.$_getArtistInfo();
  }

  created() {
    this.$_getArtistInfo();
    this.setFooterVisibility(false);
  }

  beforeDestroy() {
    this.setFooterVisibility(true);
  }

  // Helper methods
  private $_getArtistInfo() {
    const artistId = this.id;

    getArtist(artistId)
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

        this.bio = bio;
        this.birthday = birthday;
        this.origin = origin;

        if (!this.bio && !this.birthday && !this.origin) {
          this.navigationItems['about'].shouldShow = false;
        } else {
          this.navigationItems['about'].shouldShow = true;
        }

        this.loadingDone = true;

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
          this.fetchMultiplePlaylistsCatalog(artistPlaylists.slice(0, 8)).then(
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
          this.fetchMultipleAlbumsCatalog(albums.slice(0, 8)).then(albums => {
            this.albums = albums;
          });
        }

        if (singles && singles.length > 0) {
          this.fetchMultipleAlbumsCatalog(singles.slice(0, 8)).then(singles => {
            this.singles = singles;
          });
        }
      })
      .finally(() => this.dataLoadingDone());
  }
}
</script>

<style lang="scss" module>
.left-column-sticky {
  height: calc(100vh - 64px - 16px);
  position: sticky;
  top: 64px;
}

.left-column-sticky.playing {
  height: calc(100vh - 64px - 16px - 96px);
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
  background-position: 50%;
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
  margin: 0;
  z-index: 1;
}

.nav {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.nav ul {
  list-style-type: none;
}

.nav-item {
  color: rgba($color: #fff, $alpha: 0.7);
  cursor: pointer;
  font-weight: 500;
  text-transform: uppercase;
  text-align: right;
}

.nav-item.active {
  color: white;
}

.nav-item-text {
  position: relative;
}

.active .nav-item-text {
  border-bottom: 0.3rem solid var(--v-accent-base);
}
</style>
