<template>
  <v-container>
    <v-layout row wrap>
      <template>
        <template v-if="featuredAlbums.length > 0">
          <v-flex xs12 class="px-2">
            <section-header>Featured Releases</section-header>
          </v-flex>

          <NewReleaseHomeList class="pa-2" :releases="featuredAlbums" />
        </template>

        <v-flex
          xs12
          class="px-2 pt-4 featured-playlist__header"
          v-if="featuredPlaylists.length > 0"
        >
          <section-header>Featured Playlists</section-header>

          <router-link
            :to="{
              name: 'featuredPlaylists'
            }"
            class="link"
            >View all</router-link
          >
        </v-flex>

        <transition name="list">
          <v-layout row wrap v-if="featuredPlaylists.length > 0">
            <v-flex
              xs6
              sm4
              md3
              v-for="playlist in featuredPlaylists"
              :key="playlist.id"
              :class="{
                'pa-2': $vuetify.breakpoint.mdAndUp,
                'pa-1': $vuetify.breakpoint.mdAndDown
              }"
            >
              <FeaturedPlaylist :playlist="playlist" />
            </v-flex>
          </v-layout>
        </transition>
      </template>

      <template v-if="isAuthenticated && recentPlayed.length > 0">
        <v-flex xs12 class="px-2 pt-4">
          <section-header>Recently played</section-header>
        </v-flex>

        <CollectionCarousel :collections="recentPlayed" />
      </template>

      <v-flex xs12>
        <v-flex xs12 class="px-2 pt-4">
          <section-header>Browse</section-header>
        </v-flex>
        <v-layout row wrap>
          <v-flex
            xs6
            sm3
            md3
            lg2
            class="pa-2"
            v-for="category in categories"
            :key="category.name"
          >
            <router-link
              :to="{
                name: 'browse',
                params: {
                  resource: category.path
                }
              }"
            >
              <div style="width: 100%">
                <img style="width: 100%" :src="category.img" />

                <div class="main-info-text text-xs-center">
                  {{ category.name }}
                </div>
              </div>
            </router-link>
          </v-flex>
        </v-layout>
      </v-flex>

      <template v-if="genres.length > 0">
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs12 class="px-2 pt-4">
              <v-layout row align-center wrap>
                <section-header class="mr-2">New releases</section-header>

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
              </v-layout>
            </v-flex>

            <CollectionCarousel
              v-if="newReleases.length > 0"
              :collections="newReleases"
            />
          </v-layout>
        </v-flex>
      </template>

      <template v-if="albums.length > 0">
        <v-flex xs12 class="px-2 pt-4">
          <section-header>Top Albums</section-header>
        </v-flex>
        <CollectionCarousel :collections="albums" />
      </template>

      <template v-if="playlists.length > 0">
        <v-flex xs12 class="px-2 pt-4">
          <section-header>Top Playlists</section-header>
        </v-flex>
        <CollectionCarousel :collections="playlists" />
      </template>

      <template>
        <v-flex xs12 class="px-2 pt-4" v-if="activities.length > 0">
          <section-header>Activities & Mood</section-header>
        </v-flex>

        <transition name="list">
          <v-layout row wrap v-if="activities.length > 0">
            <ActivityItem
              :activity="activity"
              v-for="activity in activities"
              :key="activity.id"
            />
          </v-layout>
        </transition>
      </template>

      <v-flex xs12 class="px-2 pt-4">
        <section-header>Genres</section-header>
      </v-flex>

      <v-flex> <GenreList /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

import CollectionCarousel from '@/components/Collection/CollectionCarousel.vue';
import FeaturedPlaylist from '@/components/Collection/FeaturedPlaylist.vue';
import ActivityItem from '@/components/ActivityItem.vue';
import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import GenreList from '@/components/GenreList.vue';
import NewReleaseHomeList from '@/components/Home/NewReleaseHomeList.vue';
import musicApiService from '@/services/musicApi.service';
import { activityIds } from '@/utils/constants';
import { Action, Getter } from 'vuex-class';
import {
  FETCH_MULTIPLE_PLAYLISTS_CATALOG,
  FETCH_RECENT_PLAYED,
  FETCH_ONE_RECOMMENDATION
} from '@/store/actions.type';
import {
  FetchMultiplePlaylistsCatalogAction,
  FetchRecentPlayedAction
} from '@/store/types';
import {
  getMainFeaturedPlaylists,
  getArtworkSize,
  getFeaturedAlbums
} from '@/utils/utils';
import { Nullable } from '@/@types/model/model';

@Component({
  components: {
    FeaturedPlaylist,
    ActivityItem,
    GenreList,
    SongCollectionList,
    CollectionCarousel,
    NewReleaseHomeList
  }
})
export default class Home extends Vue {
  private featuredPlaylists: ReadonlyArray<MusicKit.Playlist> = [];
  private activities: ReadonlyArray<MusicKit.Activity> = [];
  private recentPlayed: ReadonlyArray<
    MusicKit.Playlist | MusicKit.Album | MusicKit.Station
  > = [];
  private chart: Nullable<MusicKit.ChartResponse> = null;
  private genres: string[] = [];
  private selectedNewReleasesGenre: Nullable<string> = null;
  private newReleases: MusicKit.Album[] = [];
  private featuredAlbums: any[] = [];

  private categories = [
    {
      name: 'New Music',
      img: require(`@/assets/images/newMusic/${this.artworkSize}.jpg`),
      path: 'new-music'
    },
    {
      name: 'Replay',
      img: require(`@/assets/images/replay/${this.artworkSize}.jpg`),
      path: 'replay'
    },
    {
      name: 'Sing-Along',
      img: require(`@/assets/images/singAlong/${this.artworkSize}.jpg`),
      path: 'sing-along'
    },
    {
      name: 'Girl Power',
      img: require(`@/assets/images/girlPower/${this.artworkSize}.jpg`),
      path: 'girl-power'
    }
  ];

  @Getter isAuthenticated!: boolean;

  @Action
  [FETCH_MULTIPLE_PLAYLISTS_CATALOG]: FetchMultiplePlaylistsCatalogAction;
  @Action
  [FETCH_RECENT_PLAYED]: FetchRecentPlayedAction;
  @Action [FETCH_ONE_RECOMMENDATION]: (
    id: string
  ) => Promise<MusicKit.Recommendation>;

  @Watch('isAuthenticated')
  onAuthenticationChanged(newValue: boolean) {
    this.$_getFeaturedReleases();
    if (newValue) {
      this.$_fetchRecentlyPlayed();
    }

    this.$_fetchCharts().then(() => {
      this.$_fetchFeaturedPlaylists();
    });

    this.$_getNewReleasesGenres().then(genres => {
      this.genres = genres;

      if (this.genres.length > 0) {
        this.selectedNewReleasesGenre = this.genres[0];
        this.$_getNewReleases();
      }
    });
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

  get artworkSize() {
    return getArtworkSize(this.$vuetify.breakpoint.name);
  }

  created() {
    this.$_getFeaturedReleases();

    this.$_fetchFeaturedPlaylists();
    if (this.isAuthenticated) {
      this.$_fetchRecentlyPlayed();
    }
    this.$_fetchActivities();

    this.$_fetchCharts();

    this.$_getNewReleasesGenres().then(genres => {
      this.genres = genres;

      if (this.genres.length > 0) {
        this.selectedNewReleasesGenre = this.genres[0];
        this.$_getNewReleases();
      }
    });
  }

  updateNewReleases(genre: string) {
    this.selectedNewReleasesGenre = genre;

    this.$_getNewReleases();
  }

  async $_fetchFeaturedPlaylists() {
    const playlists = await getMainFeaturedPlaylists();
    this.featuredPlaylists = playlists;
  }

  $_getNewReleasesGenres() {
    return musicApiService.getNewReleasesGenres();
  }

  $_getNewReleases() {
    if (!this.selectedNewReleasesGenre) {
      return;
    }

    return musicApiService
      .getNewReleases(this.selectedNewReleasesGenre)
      .then(releases => {
        // display just first 12 items
        if (Array.isArray(releases)) {
          this.newReleases = releases.slice(0, 12);
        } else {
          this.newReleases = [];
        }
      });
  }

  $_fetchActivities() {
    musicApiService
      .getActivities(activityIds)
      .then(activities => {
        this.activities = Object.freeze(activities);
      })
      .catch(err => err);
  }

  $_fetchRecentlyPlayed() {
    this.fetchRecentPlayed().then(result => {
      // just exclude stations for now
      this.recentPlayed = Object.freeze(
        result.filter(result => result.type !== 'stations')
      );
    });
  }

  $_fetchCharts() {
    return musicApiService
      .getCharts(['albums', 'playlists'], 10)
      .then(chart => (this.chart = chart));
  }

  $_getFeaturedReleases() {
    getFeaturedAlbums().then(releases => {
      this.featuredAlbums = releases;
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
