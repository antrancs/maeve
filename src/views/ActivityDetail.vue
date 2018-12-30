<template>
  <div v-if="activity" class="activity">
    <div class="activity-header">
      <div class="banner" :style="bannerStyle"></div>
      <v-container fluid fill-height>
        <v-layout align-end>
          <h3 class="activity-title">{{ activity.attributes.name }}</h3>
        </v-layout>
      </v-container>
    </div>
    <v-container
      fluid
      :class="{
        'grid-list-lg': $vuetify.breakpoint.mdAndUp,
        'grid-list-md': $vuetify.breakpoint.mdAndDown
      }"
      class="activity-content"
    >
      <v-layout row wrap style="z-index: 2">
        <v-flex xs12> <h3 class="section-title">Popular playlists</h3> </v-flex>

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

  created() {
    if (!this.activity) {
      const activityId = this.$route.params.id;
      musicApiService.getActivity(activityId).then(activity => {
        this.activity = activity;
        this.$forceUpdate();
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

.activity-content::before {
  background-color: var(--v-primary-base);
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  height: 6rem;
  overflow-x: hidden;
  transform: translateZ(0) skewY(-2deg);
  z-index: -1;
  outline: 0.1rem solid transparent;
  top: -2.5rem;
}

@media (min-width: $bp-phone) {
  .activity-header {
    height: 60vh;
  }
}
</style>
