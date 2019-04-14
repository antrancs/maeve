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
          <section-header>Popular playlists</section-header>
        </v-flex>

        <v-flex xs12> <SongCollectionList :collections="playlists" /> </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import InfiniteScrollMixin from '@/mixins/InfiniteScrollMixin';
import { Nullable } from '@/@types/model/model';
import { ActivityType } from '@/utils/constants';
import { getArtworkUrl } from '@/utils/utils';
import { TEXT_PRIMARY_DARK } from '@/themes';
import { Action } from 'vuex-class';
import {
  FETCH_ACTIVITY_PLAYLISTS,
  FETCH_ONE_ACTIVITY_CATALOG
} from '@/store/actions.type';
import { FetchActivityPlaylistsAction } from '@/store/types';

@Component({
  components: { SongCollectionList }
})
export default class ActivityDetail extends Mixins(InfiniteScrollMixin) {
  private activity: Nullable<MusicKit.Activity> = null;
  // already have first 10 playlists in the activity relationship
  private offset = 10;
  private playlists: MusicKit.Playlist[] = [];

  @Prop() id!: string;

  @Action [FETCH_ACTIVITY_PLAYLISTS]: FetchActivityPlaylistsAction;
  @Action [FETCH_ONE_ACTIVITY_CATALOG]: (
    id: string
  ) => Promise<MusicKit.Activity>;

  get bannerImage(): string {
    if (!this.activity || !this.activity.attributes) {
      return '';
    }

    return getArtworkUrl(this.activity.attributes.artwork.url, 1000, 1000);
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
    this.$_fetchActivityDetail();
  }

  handleScroll() {
    this.$_fetchActivityPlaylists();
  }

  async $_fetchActivityDetail() {
    if (!this.activity) {
      this.activity = await this.fetchOneActivityCatalog(this.id);

      if (
        !this.activity ||
        !this.activity.relationships ||
        !this.activity.relationships.playlists
      ) {
        return;
      }

      this.playlists = this.activity.relationships.playlists.data;

      this.$_fetchActivityPlaylists();
    }
  }

  async $_fetchActivityPlaylists() {
    this.shouldLoad = false;

    const { data, hasNext, hasNoData } = await this.fetchActivityPlaylists({
      id: this.id,
      offset: this.offset,
      limit: 10
    });

    this.playlists.push(...data);
    this.shouldLoad = true;

    this.offset += 10;
    // when there's no more data or we've reached the max items (80)
    if (!hasNext || this.offset === 80) {
      this.shouldLoad = false;
      this.noMoreData = true;
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
