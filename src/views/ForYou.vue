<template>
    <div>
      <section
        class="content-spacing"
        v-for="recommendation in recommendations"
        :key="recommendation.id"
      >
        <div class="section-header">
          <h3>{{ recommendation.attributes.title.stringForDisplay }}</h3>
        </div>

        <song-collection-list :collections="getDataArray(recommendation)">
        </song-collection-list>
      </section>
    </div>
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

  // Life cycle methods
  created() {
    musicApiService
      .getRecommendations()
      .then(result => {
        console.log('recommendation', result);
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

<style lang="scss" scoped>
</style>
