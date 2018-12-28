<template>
  <v-container
    fluid
    :class="{
      'grid-list-lg': $vuetify.breakpoint.mdAndUp,
      'grid-list-md': $vuetify.breakpoint.mdAndDown
    }"
  >
    <v-layout row wrap>
      <v-flex
        xs12
        v-for="recommendation in recommendations"
        :key="recommendation.id"
      >
        <v-layout row wrap>
          <v-flex xs12>
            <h3 class="section-title">
              {{ recommendation.attributes.title.stringForDisplay }}
            </h3>
          </v-flex>
          <v-flex xs12>
            <SongCollectionList :collections="getDataArray(recommendation)" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';
import { Collection } from '@/@types/model/model';

@Component({
  components: {
    SongCollectionList
  }
})
export default class ForYou extends Vue {
  private recommendations: MusicKit.Recommendation[] = [];

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
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * Extract all recommended collections (albums, playlists) from the recommendation
   * @param recommendations Recommendation object
   */
  getDataArray(recommendation: MusicKit.Recommendation): Collection[] {
    if (!recommendation.relationships) {
      return [];
    }

    // Single recommendation
    if (recommendation.relationships.contents) {
      return recommendation.relationships.contents.data as Collection[];
    } else if (recommendation.relationships.recommendations) {
      // Group recommendation
      const recommendations = recommendation.relationships.recommendations
        .data as MusicKit.Recommendation[];

      if (!recommendations) {
        return [];
      }

      const contents = recommendations.reduce(
        (acc: Collection[], current: MusicKit.Recommendation) =>
          acc.concat(this.getDataArray(current)),
        []
      );

      return contents;
    }
    return [];
  }
}
</script>

<style lang="scss" scoped></style>
