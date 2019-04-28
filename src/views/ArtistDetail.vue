<template>
  <div v-if="artist" class="artist-detail" fluid>
    <div class="artist-detail-header">
      <div class="banner" :style="bannerStyle"></div>
      <div class="banner-overlay flex-column artist-banner-overlay">
        <v-container fill-height>
          <v-layout column align-center>
            <MediaArtwork
              style="width: 150px; height: 150px"
              :artworkUrlForArtist="artworkUrl"
              :width="150"
              :height="150"
              :has-shadow="true"
              :isRound="true"
            />
            <v-flex>
              <h2
                :title="artist.attributes.name"
                :style="artistNameFontStyle"
                :class="[
                  'artist-detail__name',
                  { 'long-text-truncated': $vuetify.breakpoint.smAndUp }
                ]"
              >
                {{ artist.attributes.name }}
              </h2>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </div>

    <v-container
      class="pb-0 latest-release"
      v-if="$vuetify.breakpoint.smAndUp && featuredRelease"
    >
      <v-layout row wrap>
        <v-flex class="px-2 latest-release__title" xs12>
          <h2>{{ featuredReleaseTitle }}</h2>
        </v-flex>

        <v-flex xs6 sm3 md3 lg2 class="pa-2 latest-release__content">
          <LinkComponent
            :routeName="featuredRelease.type"
            :routeParams="{ id: featuredRelease.id }"
          >
            <CollectionItemCard :collection="featuredRelease" />
          </LinkComponent>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container>
      <v-layout row wrap>
        <v-flex xs12 class="px-2" v-if="bio || origin || birthday">
          <section-header>About {{ artist.attributes.name }}</section-header>
        </v-flex>
        <v-flex xs12 class="px-2">
          <v-layout row wrap>
            <v-flex
              xs12
              sm12
              md8
              v-if="bio"
              :class="{ 'pr-4': $vuetify.breakpoint.mdAndUp }"
            >
              <p :style="bioStyle" v-html="bio"></p>
              <p class="bio-toggle" @click="bioCollapse = !bioCollapse">
                {{ bioCollapse ? 'MORE' : 'LESS' }}
              </p>
            </v-flex>
            <v-flex xs12 sm12 md4>
              <template v-if="origin">
                <div class="sub-info-text">HOMETOWN</div>

                <div class="main-info-text">{{ origin }}</div>
              </template>

              <template v-if="birthday">
                <div class="sub-info-text">
                  {{ birthday.length > 4 ? 'BORN' : 'FORMED' }}
                </div>

                <div class="main-info-text">{{ birthday }}</div>
              </template>
            </v-flex>
          </v-layout>
        </v-flex>

        <template v-if="topSongs.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>Top Songs</section-header>
          </v-flex>

          <SongListLarge
            :songs="topSongs"
            :sourceName="`${artist.attributes.name}'s top songs`"
          />
        </template>

        <template v-if="nonSingles.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>Albums</section-header>
          </v-flex>

          <SongCollectionList :collections="nonSingles" />
        </template>

        <template v-if="artistType === 'library-artists'">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>Albums</section-header>
          </v-flex>

          <SongCollectionList :collections="albums" />
        </template>

        <template v-if="singles.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>EPs & Singles</section-header>
          </v-flex>

          <SongCollectionList :collections="singles" />
        </template>

        <template v-if="artistPlaylists.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>Playlists</section-header>
          </v-flex>

          <SongCollectionList :collections="artistPlaylists" />
        </template>

        <template v-if="relatedArtists.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>Related artists</section-header>
          </v-flex>
          <ArtistList :artists="relatedArtists" />
        </template>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import SongListLarge from '@/components/Song/SongListLarge.vue';
import CollectionItemCard from '@/components/Collection/CollectionItemCard.vue';
import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import LinkComponent from '@/components/LinkComponent.vue';
import ArtistList from '@/components/ArtistList.vue';
import MediaArtwork from '@/components/MediaArtwork.vue';
import musicApiService from '@/services/musicApi.service';
import { formatArtworkUrl } from '@/utils/utils';
import {
  Nullable,
  Album,
  Artist,
  Playlist,
  Collection
} from '@/@types/model/model';
import { TEXT_PRIMARY_DARK } from '@/themes';
import { Action } from 'vuex-class';
import {
  FETCH_ONE_ARTIST_LIBRARY,
  FETCH_MULTIPLE_ARTISTS_CATALOG,
  FETCH_MULTIPLE_SONGS_CATALOG,
  FETCH_MULTIPLE_PLAYLISTS_CATALOG,
  FETCH_ONE_ALBUM_CATALOG,
  FETCH_ONE_SONG_CATALOG,
  FETCH_MULTILE_ALBUMS_CATALOG
} from '@/store/actions.type';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { Route } from 'vue-router';
import {
  FetchMultipleArtitsCatalogAction,
  FetchMultipleSongsCatalogAction,
  FetchMultiplePlaylistsCatalogAction,
  FetchOneAlbumCatalogAction,
  FetchMultipleAlbumsCatalogAction
} from '@/store/types';
import { getArtistDetails } from '../services/catalog.service';

@Component({
  components: {
    SongCollectionList,
    MediaArtwork,
    ArtistList,
    CollectionItemCard,
    SongListLarge,
    LinkComponent
  }
})
export default class ArtistDetail extends Vue {
  private artist: Nullable<Artist> = null;
  // private attributes: Nullable<MusicKit.ArtistAttributes> = null;
  private artworkUrl: Nullable<string> = PLACEHOLDER_IMAGE;
  private bannerUrl: Nullable<string> = null;
  private bio: Nullable<string> = null;
  private birthday: Nullable<string> = null;
  private relatedArtists: MusicKit.Artist[] = [];
  private bioCollapse = true;
  private origin: Nullable<string> = null;
  private topSongs: MusicKit.Song[] = [];

  private artistPlaylists: MusicKit.Playlist[] = [];
  private featuredRelease: Nullable<MusicKit.Album> = null;
  private featuredReleaseTitle = '';
  private albums: MusicKit.Album[] = [];
  private singles: MusicKit.Album[] = [];

  @Action [FETCH_ONE_ARTIST_LIBRARY]!: (
    id: string
  ) => Promise<MusicKit.LibraryArtist>;
  @Action [FETCH_MULTIPLE_ARTISTS_CATALOG]: FetchMultipleArtitsCatalogAction;
  @Action [FETCH_MULTIPLE_SONGS_CATALOG]: FetchMultipleSongsCatalogAction;
  @Action
  [FETCH_MULTIPLE_PLAYLISTS_CATALOG]: FetchMultiplePlaylistsCatalogAction;
  @Action [FETCH_ONE_ALBUM_CATALOG]: FetchOneAlbumCatalogAction;
  @Action [FETCH_MULTILE_ALBUMS_CATALOG]: FetchMultipleAlbumsCatalogAction;

  created() {
    this.$_getArtistInfo();
  }

  get bioStyle() {
    if (this.bioCollapse) {
      return {
        height: '14rem',
        overflow: 'hidden'
      };
    } else {
      return {};
    }
  }

  get bannerStyle(): object {
    return {
      'background-image': `url('${this.bannerUrl}')`
    };
  }

  get headerOverlayTextStyle() {
    return {
      color: TEXT_PRIMARY_DARK
    };
  }

  get artistNameFontStyle() {
    let fontSize: number;
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        fontSize = 3.2;
        break;
      case 'sm':
        fontSize = 3.6;
        break;
      default:
        fontSize = 4;
    }
    return {
      'font-size': `${fontSize}rem`
    };
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

  // get singles(): Album[] {
  //   if (!this.artist || this.artist.type === 'library-artists') {
  //     return [];
  //   }

  //   return this.albums.filter(
  //     album =>
  //       album.type === 'albums' && album.attributes && album.attributes.isSingle
  //   );
  // }

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

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.artist = null;
    this.featuredRelease = null;
    this.bannerUrl = PLACEHOLDER_IMAGE;
    this.artistPlaylists = [];
    this.topSongs = [];
    this.bio = null;
    this.birthday = null;
    this.origin = null;
    this.albums = [];
    this.singles = [];
    this.relatedArtists = [];
    window.scrollTo(0, 0);
    this.$_getArtistInfo();
  }

  // Helper methods
  private $_getArtistInfo() {
    const artistId = this.$route.params.id;
    if (this.artistType === 'artists') {
      musicApiService
        .getArtist(artistId)
        .then(artist => {
          this.artist = artist;
          this.$_getArtistDetails();
        })
        .catch(err => err);
    } else {
      this.fetchOneArtistLibrary(artistId).then(artist => {
        this.artist = artist;
      });
    }
  }

  // Helper methods
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
    ).then((artistDetail: any) => {
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
        this.fetchMultiplePlaylistsCatalog(artistPlaylists).then(playlists => {
          this.artistPlaylists = playlists;
        });
      }

      if (feature && feature.id) {
        this.fetchOneAlbumCatalog(feature.id).then(album => {
          this.featuredRelease = album;
          this.featuredReleaseTitle = feature.title;
        });
      }

      if (albums && albums.length > 0) {
        this.fetchMultipleAlbumsCatalog(albums).then(albums => {
          this.albums = albums;
        });
      }

      if (singles && singles.length > 0) {
        this.fetchMultipleAlbumsCatalog(singles).then(singles => {
          this.singles = singles;
        });
      }
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
  color: white;
}

.artist-detail__info {
  width: 100%;
}

.bio-toggle {
  font-weight: bold;
  cursor: pointer;
}

.latest-release {
  margin-top: -25vh;
}

.latest-release__title,
.latest-release__content {
  z-index: 2;
}

.latest-release__title {
  color: white;
}
</style>
