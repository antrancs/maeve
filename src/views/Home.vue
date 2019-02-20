<template>
  <div :style="cssProps">
    <div class="grammy-bg">
      <div class="grammy-bg__content text-xs-center">
        <div class="grammy-bg__title">
          The 61st GRAMMY Awards - Nominees and winners
        </div>
        <app-button @on-click="goToGrammyPage">View results</app-button>
      </div>
    </div>
    <v-container>
      <v-layout row wrap>
        <template>
          <v-flex xs12 class="px-2" v-if="featuredPlaylists.length > 0">
            <h3 class="section-title">Featured Playlists</h3>
          </v-flex>

          <transition name="list">
            <v-layout row wrap v-if="activities.length > 0">
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
            <h3 class="section-title">Recently played</h3>
          </v-flex>

          <SongCollectionList :collections="recentPlayed" />
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
  </div>
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

@Component({
  components: {
    FeaturedPlaylist,
    ActivityItem,
    GenreList,
    SongCollectionList
  }
})
export default class Home extends Vue {
  private featuredPlaylistIds = [
    'pl.33c5def02b6047fd8c5eb3ae0009793f', // grammy
    'pl.567c541f63414e798be5cf214e155557', // Today at Apple
    'pl.2b0e6e332fdf4b7a91164da3162127b5', // Top 100 Global
    'pl.d25f5d1181894928af76c85c967f8f31' // Best of the week
    // 'pl.f4d106fed2bd41149aaacabb233eb5eb' // Today hit
  ];

  private featuredPlaylists: ReadonlyArray<MusicKit.Playlist> = [];
  private activities: ReadonlyArray<MusicKit.Activity> = [];
  private recentPlayed: ReadonlyArray<
    MusicKit.Playlist | MusicKit.Album | MusicKit.Station
  > = [];

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
  }

  get cssProps() {
    return {
      '--grammy-bg-image': `url(${this.grammyBgImage})`
    };
  }

  get grammyBgImage() {
    const baseUrl =
      'https://is4-ssl.mzstatic.com/image/thumb/Features118/v4/d4/0d/24/d40d24be-59bf-4894-76a4-d130c948132d/source/{w}x{h}sr.jpeg';

    let width: number, height: number;

    switch (this.$vuetify.breakpoint.name) {
      case 'xl':
        width = 2680;
        height = 800;
        break;
      case 'lg':
        width = 1720;
        height = 600;
        break;
      case 'md':
        width = 1240;
        height = 500;
        break;
      case 'sm':
        width = 760;
        height = 400;
        break;
      default:
        width = 400;
        height = 300;
    }

    const imageUrl = baseUrl
      .replace('{w}', width.toString())
      .replace('{h}', height.toString());

    return imageUrl;
  }

  created() {
    this.fetchMultiplePlaylistsCatalog(this.featuredPlaylistIds)
      .then(playlists => {
        this.featuredPlaylists = Object.freeze(playlists);
      })
      .catch(err => err);

    if (this.isAuthenticated) {
      this.$_fetchRecentlyPlayed();
    }

    musicApiService
      .getActivities(activityIds)
      .then(activities => {
        this.activities = Object.freeze(activities);
      })
      .catch(err => err);
  }

  goToGrammyPage() {
    this.$router.push({ path: 'grammy' });
  }

  $_fetchRecentlyPlayed() {
    this.fetchRecentPlayed().then(result => {
      // just exclude stations for now
      this.recentPlayed = Object.freeze(
        result.filter(result => result.type !== 'stations')
      );
    });
  }
}
</script>

<style lang="scss" scoped>
.grammy-bg {
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 400px;
  position: relative;
  width: 100%;
}

.grammy-bg__content {
  position: relative;
  z-index: 1;
}

.grammy-bg__title {
  font-weight: bold;
  font-size: 3rem;
  color: white;
}

.grammy-bg::before {
  content: '';
  background-image: var(--grammy-bg-image);
  background-size: cover;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.grammy-bg::after {
  background-color: rgba(0, 0, 0, 0.4);
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
