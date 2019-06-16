<template>
  <v-container class="page-content">
    <template v-if="recommendations.length > 0">
      <v-layout
        row
        wrap
        v-for="(recommendation, index) in recommendations"
        :key="recommendation.id"
        class="mb-5"
      >
        <v-flex
          lg2
          xs12
          :class="[{ 'mb-3': $vuetify.breakpoint.lgAndUp }, 'pr-3']"
        >
          <h2
            :class="[
              'recommendation-header',
              {
                'large-screen px-1': $vuetify.breakpoint.lgAndUp,
                'mb-2': $vuetify.breakpoint.mdAndDown
              }
            ]"
            :style="[
              $vuetify.breakpoint.lgAndUp ? groupRecommendationStyle(index) : {}
            ]"
          >
            {{ recommendation.title }}
          </h2>
        </v-flex>
        <v-flex xs12 lg10>
          <v-layout row wrap>
            <SongCollectionList
              :collections="recommendation.resources"
              :itemSizes="['xs6', 'sm3', 'md3', 'lg2']"
            />
          </v-layout>
        </v-flex>
      </v-layout>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import { Collection } from '@/@types/model/model';

import DataLoadingMixin from '@/mixins/DataLoadingMixin';
import {
  FETCH_RECOMMENDATIONS,
  FETCH_HEAVY_ROTATION,
  FETCH_RECENTLY_ADDED
} from '@/store/actions.type';
import {
  FetchRecommendationsAction,
  FetchRecentlyAddedAction
} from '@/store/types';

@Component({
  components: {
    SongCollectionList
  }
})
export default class ForYou extends Mixins(DataLoadingMixin) {
  private recommendations: {
    title: string;
    resources: Collection[];
  }[] = [];

  private recentlyAdded: (
    | MusicKit.LibraryAlbum
    | MusicKit.LibraryPlaylist)[] = [];

  // colors for Sunday to Saturday <3
  private recommendationHeaderColors = [
    ['#5433FF', '#20BDFF', '#A5FECB'],
    ['#FDC830', '#F37335'],
    ['#DC2424', '#4A569D'],
    ['#ff9966', '#ff5e62'],
    ['#8360c3', '#2ebf91'],
    ['#314755', '#26a0da'],
    ['#5f2c82', '#49a09d'],
    ['#67B26F', '#4ca2cd'],
    ['#ee0979', '#ff6a00']
    // [['#642B73', '#C6426E']],
    // [['#67B26F', '#4ca2cd'], ['#ee0979', '#ff6a00']],
    // [
    //   ['#2196f3', '#f44336'],
    //   ['#833ab4', '#fd1d1d', '#fcb045'],
    //   ['#EECDA3', '#EF629F']
    // ],
    // [['#FFA17F', '#00223E'], ['#FF4E50', '#F9D423'], ['#C04848', '#480048']],
    // [['#BBD2C5', '#536976', '#292E49'], ['#FFE000', '#799F0C']],
    // [['#CC95C0', '#DBD4B4', '#7AA1D2'], ['#1FA2FF', '#12D8FA', '#A6FFCB']]
  ];

  @Action [FETCH_RECOMMENDATIONS]: FetchRecommendationsAction;
  @Action [FETCH_HEAVY_ROTATION]: () => Promise<any>;
  @Action [FETCH_RECENTLY_ADDED]: FetchRecentlyAddedAction;

  created() {
    this.fetchRecommendations()
      .then(result => {
        if (!result) {
          // TODO: display no results found
          return;
        }
        this.recommendations = this.$_flattenRecommendations(result);
      })
      .catch(err => err)
      .finally(() => this.dataLoadingDone());

    this.fetchRecentlyAdded().then(resources => {
      this.recentlyAdded = resources;
    });
  }

  $_flattenRecommendations(recommendations: MusicKit.Recommendation[]) {
    const flattenedRecommendations: {
      title: string;
      resources: Collection[];
    }[] = [];

    const recursiveHelper = (recommendations: MusicKit.Recommendation[]) => {
      for (const recommendation of recommendations) {
        if (!recommendation.attributes) {
          continue;
        }

        if (!recommendation.attributes.isGroupRecommendation) {
          if (
            recommendation.relationships &&
            recommendation.relationships.contents &&
            recommendation.relationships.contents.data
          ) {
            flattenedRecommendations.push({
              title: recommendation.attributes.title.stringForDisplay,
              resources: recommendation.relationships.contents.data.splice(
                0,
                12
              ) as Collection[]
            });
          }
        } else {
          if (
            recommendation.relationships &&
            recommendation.relationships.recommendations &&
            recommendation.relationships.recommendations.data
          ) {
            recursiveHelper(recommendation.relationships.recommendations
              .data as MusicKit.Recommendation[]);
          }
        }
      }
    };

    recursiveHelper(recommendations);

    return flattenedRecommendations;
  }

  get groupRecommendationStyle() {
    return (index: number) => {
      index = index % this.recommendationHeaderColors.length;
      return {
        background: `linear-gradient(45deg, ${this.recommendationHeaderColors[
          index
        ].join(',')})`,
        'box-shadow': `0.2rem 0.2rem 1rem ${
          this.recommendationHeaderColors[index][0]
        }`
      };
    };
  }
}
</script>

<style lang="scss" scoped>
.recommendation-header {
  font-size: 3rem;
  font-weight: bold;
}

.recommendation-header.large-screen {
  font-size: 2.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  border-radius: 2rem;
}
</style>
