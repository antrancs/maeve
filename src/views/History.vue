<template>
  <v-container class="page-content">
    <content-section v-if="heavyRotation.length > 0">
      <template #section-header>
        Heavy Rotation
      </template>

      <template #section-content>
        <CollectionCarousel
          v-if="$vuetify.breakpoint.smAndDown"
          :collections="heavyRotation"
        />

        <SongCollectionList v-else :collections="heavyRotation" />
      </template>
    </content-section>
    <content-section v-if="recentlyPlayed.length > 0">
      <template #section-header>
        Recently Played
      </template>

      <template #section-content>
        <CollectionCarousel
          v-if="$vuetify.breakpoint.smAndDown"
          :collections="recentlyPlayed"
        />

        <SongCollectionList v-else :collections="recentlyPlayed" />
      </template>
    </content-section>

    <content-section v-if="recentlyAdded.length > 0">
      <template #section-header>
        Recently Added
      </template>

      <template #section-content>
        <CollectionCarousel
          v-if="$vuetify.breakpoint.smAndDown"
          :collections="recentlyAdded"
        />

        <SongCollectionList v-else :collections="recentlyAdded" />
      </template>
    </content-section>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import {
  FETCH_RECENTLY_ADDED,
  FETCH_RECENT_PLAYED,
  FETCH_HEAVY_ROTATION
} from '../store/actions.type';
import {
  FetchRecentlyAddedAction,
  FetchRecentPlayedAction,
  FetchHeavyRotationAction
} from '../store/types';
import { Collection } from '../@types/model/model';
import DataLoadingMixin from '../mixins/DataLoadingMixin';

@Component({
  components: {
    CollectionCarousel: () =>
      import('@/components/Collection/CollectionCarousel.vue'),
    SongCollectionList: () => import('@/components/Song/SongCollectionList.vue')
  }
})
export default class History extends Mixins(DataLoadingMixin) {
  private recentlyPlayed: (Collection | MusicKit.Station)[] = [];
  private recentlyAdded: Collection[] = [];
  private heavyRotation: Collection[] = [];

  @Action [FETCH_RECENTLY_ADDED]: FetchRecentlyAddedAction;
  @Action
  [FETCH_RECENT_PLAYED]: FetchRecentPlayedAction;
  @Action [FETCH_HEAVY_ROTATION]: FetchHeavyRotationAction;

  created() {
    this.$_fetchData();
  }

  $_fetchData() {
    const fetchRecentPlayedPromise = this.fetchRecentPlayed();
    const fetchRecentAddedPromise = this.fetchRecentlyAdded();
    const fetchHeavyRotationPromise = this.fetchHeavyRotation();

    Promise.all([
      fetchRecentPlayedPromise,
      fetchRecentAddedPromise,
      fetchHeavyRotationPromise
    ])
      .then(([recentlyPlayed, recentlyAdded, heavyRotation]) => {
        this.recentlyPlayed = recentlyPlayed;
        this.recentlyAdded = recentlyAdded;
        this.heavyRotation = heavyRotation;
      })
      .finally(() => this.dataLoadingDone());
  }
}
</script>
