<template>
  <v-container>
    <v-layout row wrap>
      <template v-if="featuredPlaylists.length > 0">
        <v-flex xs12 class="px-2">
          <h3 class="section-title">Featured Playlists</h3>
        </v-flex>
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
      </template>

      <template v-if="activities.length > 0">
        <v-flex xs12 class="px-2 pt-4">
          <h3 class="section-title">Activities & Mood</h3>
        </v-flex>
        <ActivityItem
          :activity="activity"
          v-for="activity in activities"
          :key="activity.id"
        />
      </template>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import FeaturedPlaylist from '@/components/FeaturedPlaylist.vue';
import ActivityItem from '@/components/ActivityItem.vue';
import musicApiService from '@/services/musicApi.service';
import { activityIds } from '@/utils/constants';

@Component({
  components: {
    FeaturedPlaylist,
    ActivityItem
  }
})
export default class Home extends Vue {
  private featuredPlaylistIds = [
    'pl.6ea68024aeae49ca9e81eaac6ef929cf', // Holiday pop hits
    'pl.2b0e6e332fdf4b7a91164da3162127b5', // Top 100 Global
    'pl.d25f5d1181894928af76c85c967f8f31', // Best of the week
    'pl.f4d106fed2bd41149aaacabb233eb5eb' // Today hit
  ];

  private featuredPlaylists: MusicKit.Playlist[] = [];
  private activities: MusicKit.Activity[] = [];

  created() {
    musicApiService
      .getPlaylists(this.featuredPlaylistIds)
      .then(playlists => {
        this.featuredPlaylists = playlists;
      })
      .catch(err => {
        console.log(err);
      });

    musicApiService
      .getActivities(activityIds)
      .then(activities => {
        this.activities = activities;
      })
      .catch(err => {
        console.log({ err });
      });
  }
}
</script>
