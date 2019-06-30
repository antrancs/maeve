<template>
  <div class="genre">
    <div class="genre-header" :style="headerBackgroundStyle" v-if="genre">
      <v-container fill-height>
        <v-layout align-end>
          <h3 class="genre-title pb-3" :style="headerOverlayTextStyle">
            {{ genre.name }}
          </h3>
        </v-layout>
      </v-container>
      <TriangleSVG />
    </div>

    <v-container class="genre-content" v-if="genre">
      <content-section v-if="hotTracks.length > 0">
        <template #section-header>
          Hot Tracks
        </template>

        <template #section-header-right>
          <router-link
            :to="{
              name: 'genresViewAll',
              params: {
                resource: 'hot-tracks',
                id
              }
            }"
            class="link"
            >View all</router-link
          >
        </template>

        <template #section-content>
          <SongListLarge
            :songs="hotTracks"
            :sourceInfo="{
              name: `${genre.name} Hot Tracks`,
              path: {
                name: 'genres',
                params: {
                  id
                }
              }
            }"
          />
        </template>
      </content-section>

      <content-section v-if="playlists.length > 0">
        <template #section-header>
          Playlists
        </template>

        <template #section-header-right>
          <router-link
            :to="{
              name: 'genresViewAll',
              params: {
                resource: 'playlists',
                id
              }
            }"
            class="link"
            >View all</router-link
          >
        </template>

        <template #section-content>
          <CollectionCarousel
            v-if="$vuetify.breakpoint.smAndDown"
            :collections="playlists"
          />
          <SongCollectionList v-else :collections="playlists" />
        </template>
      </content-section>

      <content-section v-if="newReleases.length > 0">
        <template #section-header>
          New Releases
        </template>

        <template #section-header-right>
          <router-link
            :to="{
              name: 'genresViewAll',
              params: {
                resource: 'new-releases',
                id
              }
            }"
            class="link"
            >View all</router-link
          >
        </template>

        <template #section-content>
          <CollectionCarousel
            v-if="$vuetify.breakpoint.smAndDown"
            :collections="newReleases"
          />
          <SongCollectionList v-else :collections="newReleases" />
        </template>
      </content-section>

      <content-section v-if="essentialAlbums.length > 0">
        <template #section-header>
          Essential Albums
        </template>

        <template #section-header-right>
          <router-link
            :to="{
              name: 'genresViewAll',
              params: {
                resource: 'essential-albums',
                id
              }
            }"
            class="link"
            >View all</router-link
          >
        </template>

        <template #section-content>
          <CollectionCarousel
            v-if="$vuetify.breakpoint.smAndDown"
            :collections="essentialAlbums"
          />
          <SongCollectionList v-else :collections="essentialAlbums" />
        </template>
      </content-section>

      <content-section v-if="artistPlaylists.length > 0">
        <template #section-header>
          Artist Playlists
        </template>

        <template #section-header-right>
          <router-link
            :to="{
              name: 'genresViewAll',
              params: {
                resource: 'artist-playlists',
                id
              }
            }"
            class="link"
            >View all</router-link
          >
        </template>

        <template #section-content>
          <CollectionCarousel
            v-if="$vuetify.breakpoint.smAndDown"
            :collections="artistPlaylists"
          />
          <SongCollectionList v-else :collections="artistPlaylists" />
        </template>
      </content-section>
    </v-container>

    <!-- <v-container class="genre-content pt-0" v-if="curators.length > 0">
      <v-layout row wrap style="z-index: 2">
        <v-flex xs12 class="px-2">
          <section-header>Curators</section-header>
        </v-flex>

        <v-flex xs12>
          <CuratorList :curators="curators" />
        </v-flex>
      </v-layout>
    </v-container> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import TriangleSVG from '@/components/TriangleSVG.vue';
import SongListLarge from '@/components/Song/SongListLarge.vue';
// import CollectionCarousel from '@/components/Collection/CollectionCarousel.vue';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';
import { Nullable } from '@/@types/model/model';
import { Genre, GENRES } from '@/utils/constants';
import { getArtworkUrl } from '@/utils/utils';
import { TEXT_PRIMARY_DARK } from '@/themes';

import {
  FETCH_MULTIPLE_CURATORS,
  FETCH_MULTIPLE_SONGS_CATALOG
} from '@/store/actions.type';
import { FetchMultipleSongsCatalogAction } from '@/store/types';
import { getOneGenreForCountry } from '../services/catalog.service';

@Component({
  components: {
    SongListLarge,
    CollectionCarousel: () =>
      import('@/components/Collection/CollectionCarousel.vue'),
    TriangleSVG,
    SongCollectionList: () => import('@/components/Song/SongCollectionList.vue')
  }
})
export default class GenreDetail extends Mixins(DataLoadingMixin) {
  private genre: Nullable<Genre> = null;
  private playlists: MusicKit.Playlist[] = [];
  // private curators: MusicKit.Curator[] = [];
  private hotTracks: MusicKit.Song[] = [];
  private newReleases: MusicKit.Album[] = [];
  private essentialAlbums: MusicKit.Album[] = [];
  private artistPlaylists: MusicKit.Playlist[] = [];

  @Prop() id!: string;

  @Action [FETCH_MULTIPLE_CURATORS]: (
    ids: string[]
  ) => Promise<MusicKit.Curator[]>;
  @Action [FETCH_MULTIPLE_SONGS_CATALOG]: FetchMultipleSongsCatalogAction;

  get headerBackgroundStyle() {
    if (!this.genre || !this.genre.colors) {
      return {};
    }
    return {
      background: `linear-gradient(45deg, ${this.genre.colors.join(',')})`
    };
  }

  get headerOverlayTextStyle() {
    return {
      color: TEXT_PRIMARY_DARK
    };
  }

  get fetchLimit(): number {
    let fetchLimit = 8;
    switch (this.$vuetify.breakpoint.name) {
      case 'md':
        fetchLimit = 10;
        break;
      case 'lg':
        fetchLimit = 12;
        break;
      case 'xl':
        fetchLimit = 14;
        break;
    }
    return fetchLimit;
  }

  created() {
    this.$_fetchCurators();
    this.$_fetchGenreData();
  }

  async $_fetchCurators() {
    // if (!this.genre) {
    //   return;
    // }
    // const curatorIds = await getCuratorsByGenre(this.genre.id);
    // if (curatorIds && curatorIds.length > 0) {
    //   this.curators = await this.fetchMultipleCurators(curatorIds);
    // }
  }

  async $_fetchGenreData() {
    const result = await getOneGenreForCountry(this.id, this.fetchLimit);
    if (Object.keys(result).length === 0) {
      return;
    }

    this.genre = result.genre;
    this.dataLoadingDone();

    const hotTrackIds = result['hotTracks'];

    if (hotTrackIds && Array.isArray(hotTrackIds) && hotTrackIds.length > 0) {
      this.fetchMultipleSongsCatalog(hotTrackIds.slice(0, 10)).then(songs => {
        this.hotTracks = songs;
      });
    }

    const newReleases = result['newReleases'];
    if (newReleases && Array.isArray(newReleases)) {
      this.newReleases = newReleases;
    }

    const essentialAlbums = result['essentialAlbums'];
    if (essentialAlbums && Array.isArray(essentialAlbums)) {
      this.essentialAlbums = essentialAlbums;
    }

    const artistPlaylists = result['artistPlaylists'];
    if (artistPlaylists && Array.isArray(artistPlaylists)) {
      this.artistPlaylists = artistPlaylists;
    }

    const playlists = result['playlists'];
    if (playlists && Array.isArray(playlists)) {
      this.playlists = playlists;
    }
  }
}
</script>

<style lang="scss" scoped>
.genre-header {
  justify-content: flex-end;
  height: 40vh;
  position: relative;
  width: 100%;
}

.genre-title {
  font-size: $xl-font;
  position: relative;
}

.genre-content {
  position: relative;
  width: 100%;
}
</style>
