<template>
  <div class="home">
    <section class="content-spacing" v-if="featuredPlaylists.length > 0">
      <h3 class="section-title">Featured Playlists</h3>
      <div class="flex-row feature-playlists">
        <featured-playlist
          v-for="playlist in featuredPlaylists"
          :key="playlist.id"
          :playlist="playlist"
        >
        </featured-playlist>
      </div>
    </section>

    <section class="content-spacing" v-if="activities.length > 0">
      <h2 class="section-title">Activities & Mood</h2>
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
  // Data
  private featuredPlaylistIds = [
    'pl.6ea68024aeae49ca9e81eaac6ef929cf', // Holiday pop hits
    'pl.b0e04e25887741ea845e1d5c88397fd4', // Essential Xmas
    'pl.567c541f63414e798be5cf214e155557', // Today at Apple
    'pl.2b0e6e332fdf4b7a91164da3162127b5', // Top 100 Global
    'pl.d25f5d1181894928af76c85c967f8f31', // Best of the week
    'pl.a0214a4b459d4f79a991d1151e6f211f', // Future hits
    'pl.f4d106fed2bd41149aaacabb233eb5eb', // Today hit
    'pl.2d4d74790f074233b82d07bfae5c219c' // Its lit
  ];

  private featuredPlaylists: MusicKit.Playlist[] = [];
  private activities: MusicKit.Activity[] = [];

  // Life cycle methods
  created() {
    musicApiService
      .getPlaylists(this.featuredPlaylistIds)
      .then(playlists => {
        this.featuredPlaylists = playlists;
      })
      .catch(err => {
        console.log(err);
      });

    // musicApiService
    //   .getActivities(activityIds)
    //   .then(activities => {
    //     this.activities = activities;
    //   })
    //   .catch(err => {
    //     console.log({ err });
    //   });
  }
}
</script>

<style lang="scss" scoped>
</style>
