<template>
  <v-container>
    <v-layout row wrap>
      <template>
        <v-flex
          xs12
          class="px-2 featured-playlist__header"
          v-if="featuredPlaylists.length > 0"
        >
          <h3 class="section-title">Today's Featured Playlists</h3>

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

      <template v-if="genres.length > 0">
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs12 class="px-2 pt-4">
              <v-layout row align-center wrap>
                <h2 class="section-title mr-2">New releases</h2>

                <v-menu offset-y>
                  <v-btn round color="accent" dark slot="activator">
                    {{ selectedNewReleasesGenre }}
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

            <SongCollectionList :collections="newReleases" />
          </v-layout>
        </v-flex>
      </template>

      <template v-if="isAuthenticated && recentPlayed.length > 0">
        <v-flex xs12 class="px-2 pt-4">
          <h2 class="section-title">Recently played</h2>
        </v-flex>

        <SongCollectionList :collections="recentPlayed" />
      </template>

      <template v-if="albums.length > 0">
        <v-flex xs12 class="px-2 pt-4">
          <h2 class="section-title">Top Albums</h2>
        </v-flex>
        <SongCollectionList :collections="albums" />
      </template>

      <template v-if="playlists.length > 0">
        <v-flex xs12 class="px-2 pt-4">
          <h2 class="section-title">Top Playlists</h2>
        </v-flex>
        <SongCollectionList :collections="playlists" />
      </template>

      <template>
        <v-flex xs12 class="px-2 pt-4" v-if="activities.length > 0">
          <h3 class="section-title">Activities & Mood</h3>
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
        <h3 class="section-title">Genres</h3>
      </v-flex>

      <v-flex> <GenreList /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

import FeaturedPlaylist from '@/components/FeaturedPlaylist.vue';
import ActivityItem from '@/components/ActivityItem.vue';
import SongCollectionList from '@/components/SongCollectionList.vue';
import GenreList from '@/components/GenreList.vue';
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
import { getMainFeaturedPlaylists } from '@/utils/utils';
import { Nullable } from '@/@types/model/model';

@Component({
  components: {
    FeaturedPlaylist,
    ActivityItem,
    GenreList,
    SongCollectionList
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
  private newReleases: MusicKit.Album[] | null = null;

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

  created() {
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
          this.newReleases = null;
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
}
</script>

<style lang="scss" scoped>
.featured-playlist__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
</style>
