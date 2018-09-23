<template>
  <div v-if="activity" class="content-spacing activity">
    <div class="activity-header flex-column ">
      <div class="banner" :style="bannerStyle"></div>
      <h3 class="activity-title">{{ activity.attributes.name }}</h3>
    </div>
    <div class="activity-content">
      <div class="activity-list">
        <h3>Popular playlists</h3>

        <song-collection-list :collections="playlists"></song-collection-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';
import { Nullable } from '@/@types/model/model';
import { ActivityType } from '@/utils/constants';

@Component({
  components: { SongCollectionList }
})
export default class ActivityDetail extends Vue {
  // Data
  private activity: Nullable<MusicKit.Activity> = null;

  get bannerImage(): string {
    if (!this.activity) {
      return '';
    }

    switch (this.activity.id) {
      case ActivityType.Workout:
        return require('./../assets/workout.jpg');
      case ActivityType.Sad:
        return require('./../assets/sad.jpg');
      case ActivityType.Focus:
        return require('./../assets/focus.jpg');
      case ActivityType.Romance:
        return require('./../assets/romance.jpg');
      case ActivityType.Decade:
        return require('./../assets/decades.jpg');
      case ActivityType.Chill:
        return require('./../assets/chill.jpg');
      case ActivityType.Motivation:
        return require('./../assets/motivation.jpg');
      case ActivityType.Party:
        return require('./../assets/party.jpg');
      default:
        return '';
    }
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
      'background-image': `url('${this.bannerImage}')`,
      'background-position': '50%'
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
  height: 45vh;
  position: relative;
  width: 100%;
}

.activity-title {
  font-size: $xl-font;
  margin: 0 0 $xl-size $m-size;
  position: relative;
  z-index: 2;
}

.banner {
  background-color: rgba(0, 0, 0, 0.4);
  background-image: url('./../assets/workout.jpg');
  background-size: cover;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
}

.activity-content {
  position: relative;
  width: 100%;
}

.activity-list {
  position: relative;
  z-index: 4;

  & h3 {
    margin-top: 0;
    padding-top: $l-size;
  }
}

.activity-content::before {
  background-color: $bg-color;
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  height: 6rem;
  overflow-x: hidden;
  transform: translateZ(0) skewY(-2deg);
  z-index: 3;
  outline: 1px solid transparent;
  top: -2.5rem;
}
</style>
