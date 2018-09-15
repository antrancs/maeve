<template>
    <div class="content-spacing">
      <section v-for="recommendation in recommendations" :key="recommendation.id">
        <div class="section-header">
          <h3>{{ recommendation.attributes.title.stringForDisplay }}</h3>
        </div>
        <song-collection-list :collections="getDataArray(recommendation)"></song-collection-list>
      </section>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';

@Component({
  components: {
    SongCollectionList
  }
})
export default class ForYou extends Vue {
  private recommendations: any[] = [];

  getDataArray(recommendation: any): any[] {
    if (recommendation.relationships.contents) {
      return recommendation.relationships.contents.data;
    } else if (recommendation.relationships.recommendations) {
      const contents = recommendation.relationships.recommendations.data.reduce(
        (acc: any[], current: any) => {
          return acc.concat(this.getDataArray(current));
        },
        []
      );
      return contents;
    }
    return [];
  }

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
}
</script>

<style lang="scss" scoped>
</style>
