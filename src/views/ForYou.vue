<template>
  <v-container>
    <transition name="list">
      <v-layout row wrap v-if="recommendations.length > 0">
        <v-flex
          xs12
          v-for="recommendation in recommendations"
          :key="recommendation.id"
          class="mt-4"
        >
          <v-layout row wrap>
            <v-flex xs12 class="px-2">
              <h3 class="section-title">
                {{ recommendation.attributes.title.stringForDisplay }}
              </h3>
            </v-flex>
            <v-flex
              xs12
              v-if="!recommendation.attributes.isGroupRecommendation"
            >
              <SongCollectionList
                :collections="recommendation.relationships.contents.data"
              />
            </v-flex>

            <template v-else>
              <v-flex
                xs12
                row
                wrap
                v-for="(subRecommendation, index) in recommendation
                  .relationships.recommendations.data"
                :key="`${subRecommendation.id}-${index}`"
              >
                <v-layout row wrap>
                  <v-flex xs12 sm12 md2 class="pa-2">
                    <div
                      class="reason-group-recommendation px-4"
                      :style="getGroupRecommendationStyle(index)"
                    >
                      {{ subRecommendation.attributes.reason.stringForDisplay }}
                    </div>
                  </v-flex>

                  <v-flex
                    xs6
                    sm3
                    md2
                    class="pa-2"
                    v-for="(collection, index) in subRecommendation
                      .relationships.contents.data"
                    :key="`${collection.id}-${index}`"
                  >
                    <CollectionItemCard :collection="collection" />
                  </v-flex>
                </v-layout>
              </v-flex>
            </template>
          </v-layout>
        </v-flex>
      </v-layout>
    </transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import CollectionItemCard from '@/components/CollectionItemCard.vue';
import { Collection } from '@/@types/model/model';
import { Action } from 'vuex-class';
import {
  FETCH_RECOMMENDATIONS,
  FETCH_HEAVY_ROTATION
} from '@/store/actions.type';
import { FetchRecommendationsAction } from '@/store/types';

@Component({
  components: {
    SongCollectionList,
    CollectionItemCard
  }
})
export default class ForYou extends Vue {
  private recommendations: MusicKit.Recommendation[] = [];
  // colors for Sunday to Saturday <3
  private groupRecommendationColors = [
    [
      ['#9796f0', '#fbc7d4'],
      ['#5433FF', '#20BDFF', '#A5FECB'],
      ['#DC2424', '#4A569D'],
      ['#5f2c82', '#49a09d']
    ],
    [
      ['#dd3e54', '#6be585'],
      ['#FDC830', '#F37335'],
      ['#8360c3', '#2ebf91'],
      ['#642B73', '#C6426E']
    ],
    [
      ['#ff9966', '#ff5e62'],
      ['#67B26F', '#4ca2cd'],
      ['#F3904F', '#3B4371'],
      ['#ee0979', '#ff6a00']
    ],
    [
      ['#2196f3', '#f44336'],
      ['#833ab4', '#fd1d1d', '#fcb045'],
      ['#EECDA3', '#EF629F'],
      ['#004FF9', '#FFF94C']
    ],
    [
      ['#FFA17F', '#00223E'],
      ['#4DA0B0', '#D39D38'],
      ['#FF4E50', '#F9D423'],
      ['#C04848', '#480048']
    ],
    [
      ['#4776E6', '#8E54E9'],
      ['#FF512F', '#DD2476'],
      ['#BBD2C5', '#536976', '#292E49'],
      ['#FFE000', '#799F0C']
    ],
    [
      ['#e65c00', '#F9D423'],
      ['#CC95C0', '#DBD4B4', '#7AA1D2'],
      ['#314755', '#26a0da'],
      ['#1FA2FF', '#12D8FA', '#A6FFCB']
    ]
  ];

  @Action [FETCH_RECOMMENDATIONS]: FetchRecommendationsAction;
  @Action [FETCH_HEAVY_ROTATION]: () => Promise<any>;

  created() {
    this.fetchRecommendations()
      .then(result => {
        if (!result) {
          // TODO: display no results found
          return;
        }
        this.recommendations = result;
      })
      .catch(err => err);

    // this.fetchHeavyRotation().then(res => {
    //   console.log('heavy', res);
    // });
  }

  getGroupRecommendationStyle(index: number) {
    // get current day of the week
    const day = new Date().getDay();
    return {
      background: `linear-gradient(45deg, ${this.groupRecommendationColors[day][
        index
      ].join(',')})`,
      'box-shadow': `0.2rem 0.2rem 1rem ${
        this.groupRecommendationColors[day][index][0]
      }`
    };
  }

  spitWords(text: string) {
    return text.replace(/\s/g, '\n');
  }
}
</script>

<style lang="scss" scoped>
.reason-group-recommendation {
  border-radius: 0.8rem;
  display: flex;
  font-weight: bold;
  color: white;
  font-size: 2rem;
  justify-items: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
