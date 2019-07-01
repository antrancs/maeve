<template>
  <v-container>
    <content-section v-if="featuredAlbums.length > 0">
      <template #section-header>
        Featured Releases
      </template>

      <template #section-content>
        <NewReleaseHomeList :releases="featuredAlbums" />
      </template>
    </content-section>

    <content-section v-if="featuredPlaylists.length > 0">
      <template #section-header>
        Featured Playlists
      </template>

      <template #section-header-right>
        <router-link
          :to="{
            name: 'featuredPlaylists'
          }"
          class="link"
          >View all</router-link
        >
      </template>

      <template #section-content>
        <transition name="list">
          <v-layout
            row
            wrap
            v-if="featuredPlaylists.length > 0"
            class="section-offset"
          >
            <v-flex
              xs6
              sm4
              md4
              lg3
              v-for="playlist in featuredPlaylists"
              :key="playlist.id"
              class="px-2 pb-3 xl-5-col"
            >
              <FeaturedPlaylist :playlist="playlist" />
            </v-flex>
          </v-layout>
        </transition>
      </template>
    </content-section>

    <content-section v-if="browseCategories.length > 0">
      <template #section-header>
        Browse
      </template>

      <template #section-content>
        <v-layout row wrap class="section-offset">
          <v-flex
            xs6
            sm3
            md3
            lg2
            class="px-2 pb-2"
            v-for="category in browseCategories"
            :key="category.name"
          >
            <router-link
              :to="{
                name: 'browse',
                params: {
                  resource: category.id
                }
              }"
            >
              <div style="width: 100%">
                <img
                  style="width: 100%"
                  v-lazy="
                    `https:${
                      category.imageUrl
                    }?w=${browseCategorySize}&h=${browseCategorySize}`
                  "
                  :alt="category.name"
                />

                <div class="main-info-text text-xs-center">
                  {{ category.name }}
                </div>
              </div>
            </router-link>
          </v-flex>
        </v-layout>
      </template>
    </content-section>

    <content-section v-if="genres.length > 0">
      <template #section-header>
        New releases
      </template>

      <template #section-header-right>
        <v-menu offset-y>
          <v-btn round color="accent" dark slot="activator">
            {{ selectedNewReleasesGenre }}
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
          <v-list class="primary lighten-1">
            <v-list-tile
              v-for="(genre, index) in genres"
              :key="index"
              @click="() => updateNewReleases(genre)"
            >
              <v-list-tile-title>{{ genre }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>

      <template #section-content>
        <CollectionCarousel
          v-if="newReleases.length > 0 && $vuetify.breakpoint.smAndDown"
          :collections="newReleases"
        />

        <SongCollectionList
          v-if="newReleases.length > 0 && $vuetify.breakpoint.mdAndUp"
          :collections="newReleases"
        />
      </template>
    </content-section>

    <content-section v-if="albums.length > 0">
      <template #section-header>
        Top Albums
      </template>

      <template #section-content>
        <CollectionCarousel
          v-if="$vuetify.breakpoint.smAndDown"
          :collections="albums"
        />
        <SongCollectionList v-else :collections="albums" />
      </template>
    </content-section>

    <content-section v-if="playlists.length > 0">
      <template #section-header>
        Top Playlists
      </template>

      <template #section-content>
        <CollectionCarousel
          v-if="$vuetify.breakpoint.smAndDown"
          :collections="playlists"
        />
        <SongCollectionList v-else :collections="playlists" />
      </template>
    </content-section>

    <content-section v-if="activities.length > 0">
      <template #section-header>
        Activities & Mood
      </template>

      <template #section-content>
        <transition name="list">
          <v-layout
            row
            wrap
            v-if="activities.length > 0"
            class="section-offset"
          >
            <ActivityItem
              :activity="activity"
              v-for="activity in activities"
              :key="activity.id"
            />
          </v-layout>
        </transition>
      </template>
    </content-section>

    <content-section v-if="genreItems.length > 0">
      <template #section-header>
        Genres
      </template>

      <template #section-content>
        <GenreList :genres="genreItems" />
      </template>
    </content-section>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch, Mixins } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

import FeaturedPlaylist from '@/components/Collection/FeaturedPlaylist.vue';
import ActivityItem from '@/components/ActivityItem.vue';
import GenreList from '@/components/GenreList.vue';
import NewReleaseHomeList from '@/components/Home/NewReleaseHomeList.vue';
import { activityIds } from '@/utils/constants';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';
import {
  FETCH_MULTIPLE_PLAYLISTS_CATALOG,
  FETCH_ONE_RECOMMENDATION
} from '@/store/actions.type';
import { FetchMultiplePlaylistsCatalogAction } from '@/store/types';
import { Nullable, GenreItem } from '@/@types/model/model';
import {
  getAllBrowseCategories,
  getGenresForCountry,
  getMainFeaturedPlaylists,
  getFeaturedAlbums,
  getNewReleases,
  getNewReleasesGenres
} from '../services/catalog.service';
import { getActivities, getCharts } from '../services/musicApi.service';

@Component({
  components: {
    FeaturedPlaylist,
    ActivityItem,
    GenreList,
    CollectionCarousel: () =>
      import('@/components/Collection/CollectionCarousel.vue'),
    NewReleaseHomeList,
    SongCollectionList: () => import('@/components/Song/SongCollectionList.vue')
  }
})
export default class Home extends Mixins(DataLoadingMixin) {
  private featuredPlaylists: ReadonlyArray<MusicKit.Playlist> = [];
  private activities: ReadonlyArray<MusicKit.Activity> = [];

  private chart: Nullable<MusicKit.ChartResponse> = null;
  private genres: string[] = [];
  private selectedNewReleasesGenre: Nullable<string> = null;
  private newReleases: MusicKit.Album[] = [];
  private featuredAlbums: any[] = [];
  private browseCategories: any[] = [];
  private genreItems: GenreItem[] = [];

  @Getter isAuthenticated!: boolean;

  @Action
  [FETCH_MULTIPLE_PLAYLISTS_CATALOG]: FetchMultiplePlaylistsCatalogAction;
  @Action [FETCH_ONE_RECOMMENDATION]: (
    id: string
  ) => Promise<MusicKit.Recommendation>;

  @Watch('isAuthenticated')
  onAuthenticationChanged(newValue: boolean) {
    this.$_fetchCharts().then(() => {
      this.$_fetchFeaturedPlaylists();
      this.$_getFeaturedReleases();
      this.$_getGenres();
    });

    this.$_getNewReleasesGenre();
  }

  get playlists(): MusicKit.Playlist[] {
    if (!this.chart || this.chart.playlists.length === 0) {
      return [];
    }

    return (this.chart.playlists[0].data as MusicKit.Playlist[]) || [];
  }

  get albums(): MusicKit.Album[] {
    if (!this.chart || this.chart.albums.length === 0) {
      return [];
    }

    return (this.chart.albums[0].data as MusicKit.Album[]) || [];
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

  get browseCategorySize() {
    switch (this.$vuetify.breakpoint.name) {
      case 'lg':
        return 180;
      case 'xl':
        return 280;
      case 'md':
        return 200;
      case 'xs':
        return 220;
      default:
        return 200;
    }
  }

  created() {
    this.$_getFeaturedReleases();
    this.$_fetchFeaturedPlaylists();
    this.$_fetchActivities();
    this.$_fetchCharts();

    this.$_getNewReleasesGenre();
    getAllBrowseCategories().then(categories => {
      this.browseCategories = categories;
    });

    this.$_getGenres();
  }

  updateNewReleases(genre: string) {
    this.selectedNewReleasesGenre = genre;

    this.$_getNewReleases();
  }

  async $_fetchFeaturedPlaylists() {
    let limit = 4;

    switch (this.$vuetify.breakpoint.name) {
      case 'sm':
      case 'md':
        limit = 3;
        break;
      case 'xl':
        limit = 5;
    }

    const playlists = await getMainFeaturedPlaylists(limit);
    this.featuredPlaylists = playlists;
  }

  $_getNewReleases() {
    if (!this.selectedNewReleasesGenre) {
      return;
    }

    return getNewReleases(this.selectedNewReleasesGenre, this.fetchLimit).then(
      releases => {
        // display just first 12 items
        if (Array.isArray(releases)) {
          this.newReleases = releases.slice(0, 12);
        } else {
          this.newReleases = [];
        }
      }
    );
  }

  $_fetchActivities() {
    getActivities(activityIds)
      .then(activities => {
        this.activities = Object.freeze(activities);
      })
      .catch(err => err);
  }

  $_fetchCharts() {
    return getCharts(['albums', 'playlists'], this.fetchLimit).then(
      chart => (this.chart = chart)
    );
  }

  $_getFeaturedReleases() {
    getFeaturedAlbums()
      .then(releases => {
        this.featuredAlbums = releases;
      })
      .finally(() => this.dataLoadingDone());
  }

  $_getGenres() {
    getGenresForCountry().then(genres => {
      this.genreItems = genres;
    });
  }

  $_getNewReleasesGenre() {
    getNewReleasesGenres().then(genres => {
      this.genres = genres;

      if (this.genres.length > 0) {
        this.selectedNewReleasesGenre = this.genres[0];
        this.$_getNewReleases();
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.featured-playlist__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
</style>
