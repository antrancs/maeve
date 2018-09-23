<template>
  <div class="home">
    <section class="content-spacing">
      <h2>Featured Playlists</h2>
      <div class="flex-row">
        <featured-playlist
          v-for="playlist in featuredPlaylists"
          :key="playlist.id"
          :playlist="playlist"
        >
        </featured-playlist>
      </div>
    </section>

    <section class="content-spacing">
      <h2>Activities & Mood</h2>
      <div class="flex-row">
        <activity-item
          v-for="activity in activities"
          :key="activity.id"
          :activity="activity"
        >
        </activity-item>
      </div>
    </section>
  </div>
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
    'pl.567c541f63414e798be5cf214e155557', // Today at Apple
    'pl.2b0e6e332fdf4b7a91164da3162127b5', // Top 100 Global
    'pl.d25f5d1181894928af76c85c967f8f31' // Best of the week
  ];

  private featuredPlaylists: MusicKit.Playlist[] = [];
  private activities: MusicKit.Activity[] = [];

  created() {
    console.log(activityIds);
    musicApiService
      .getPlaylists(this.featuredPlaylistIds)
      .then(playlists => {
        this.featuredPlaylists = playlists;
      })
      .catch(err => {
        console.log(err);
      });

    musicApiService.getActivities(activityIds).then(activities => {
      console.log(activities);
      this.activities = activities;
    });
  }
}
</script>
