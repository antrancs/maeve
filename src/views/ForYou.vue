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
import musicApiService from '@/services/musicApi.service';
import { Collection } from '@/@types/model/model';

@Component({
  components: {
    SongCollectionList,
    CollectionItemCard
  }
})
export default class ForYou extends Vue {
  private recommendations: MusicKit.Recommendation[] = [];
  private groupRecommendationColors = [
    ['#9796f0', '#fbc7d4'],
    ['#5433FF', '#20BDFF', '#A5FECB'],
    ['#DC2424', '#4A569D'],
    ['#5f2c82', '#49a09d']
  ];

  created() {
    musicApiService
      .getRecommendations()
      .then(result => {
        if (!result) {
          // TODO: display no results found
          return;
        }
        this.recommendations = result;
      })
      .catch(err => err);
  }

  getGroupRecommendationStyle(index: number) {
    return {
      background: `linear-gradient(45deg, ${this.groupRecommendationColors[
        index
      ].join(',')})`,
      'box-shadow': `0.2rem 0.2rem 1rem ${
        this.groupRecommendationColors[index][0]
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
