<template>
  <div v-if="activity" class="activity">
    <div class="activity-header">
      <div class="banner" :style="bannerStyle"></div>
      <v-container fill-height>
        <v-layout align-end>
          <h3 class="activity-title" :style="headerOverlayTextStyle">
            {{ activity.attributes.name }}
          </h3>
        </v-layout>
      </v-container>
    </div>

    <v-container fluid class="skew-div"></v-container>
    <v-container class="activity-content pt-0">
      <v-layout row wrap style="z-index: 2">
        <v-flex xs12 class="px-2">
          <h3 class="section-title">Popular playlists</h3>
        </v-flex>

        <v-flex xs12> <SongCollectionList :collections="playlists" /> </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';
import { Nullable } from '@/@types/model/model';
import { ActivityType } from '@/utils/constants';
import { getArtworkUrl } from '@/utils/utils';
import { TEXT_PRIMARY_DARK } from '@/themes';

@Component({
  components: { SongCollectionList }
})
export default class ActivityDetail extends Vue {
  private activity: Nullable<MusicKit.Activity> = null;

  get bannerImage(): string {
    if (!this.activity || !this.activity.attributes) {
      return '';
    }

    return getArtworkUrl(this.activity.attributes.artwork.url, 1000, 1000);
  }

  get playlists(): MusicKit.Playlist[] {
    if (
      !this.activity ||
      !this.activity.relationships ||
      !this.activity.relationships.playlists
    ) {
      return [];
    }

    return this.activity.relationships.playlists.data;
  }

  get bannerStyle(): object {
    return {
      'background-image': `url('${this.bannerImage}')`
    };
  }

  get headerOverlayTextStyle() {
    return {
      color: TEXT_PRIMARY_DARK
    };
  }

  created() {
    if (!this.activity) {
      const activityId = this.$route.params.id;
      musicApiService.getActivity(activityId).then(activity => {
        this.activity = activity;
        // this.$forceUpdate();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-header {
  justify-content: flex-end;
  height: 30vh;
  position: relative;
  width: 100%;
}

.activity-title {
  font-size: $xl-font;
  position: relative;
  z-index: 2;
}

.activity-content {
  position: relative;
  width: 100%;
  z-index: 2;
}

@media (min-width: $bp-phone) {
  .activity-header {
    height: 60vh;
  }
}
</style>
