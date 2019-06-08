<template>
  <div v-if="activity" class="activity">
    <div class="activity-header">
      <div class="banner" :style="bannerStyle"></div>
      <v-container fill-height>
        <v-layout align-end>
          <h3 class="activity-title pb-3" :style="headerOverlayTextStyle">
            {{ activity.attributes.name }}
          </h3>
        </v-layout>

        <TriangleSVG />
      </v-container>
    </div>

    <v-container class="activity-content">
      <v-layout row wrap>
        <content-section>
          <template #section-header>
            Popular playlists
          </template>

          <template #section-content>
            <v-flex xs12>
              <SongCollectionList :collections="playlists" />
            </v-flex>
          </template>
        </content-section>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import TriangleSVG from '@/components/TriangleSVG.vue';
import { Nullable } from '@/@types/model/model';
import { ActivityType } from '@/utils/constants';
import { getArtworkUrl } from '@/utils/utils';
import { TEXT_PRIMARY_DARK } from '@/themes';
import InfiniteScrollMixin from '@/mixins/InfiniteScrollMixin';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';

import {
  FETCH_ACTIVITY_PLAYLISTS,
  FETCH_ONE_ACTIVITY_CATALOG
} from '@/store/actions.type';
import { FetchActivityPlaylistsAction } from '@/store/types';

@Component({
  components: { SongCollectionList, TriangleSVG }
})
export default class ActivityDetail extends Mixins(
  InfiniteScrollMixin,
  DataLoadingMixin
) {
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

    return getArtworkUrl(this.activity.attributes.artwork, 1000, 1000);
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
      this.dataLoadingDone();
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
  height: 50vh;
  position: relative;
  width: 100%;
}

.activity-title {
  font-size: $xl-font;
  position: relative;
}

.activity-content {
  position: relative;
  width: 100%;
}
</style>
