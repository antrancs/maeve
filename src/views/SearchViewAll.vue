<template>
  <div class="content-spacing">
    <h2>Show All</h2>
    <song-collection-list :collections="data"></song-collection-list>
    <infinite-loading @infinite="infiniteHandler" spinner="circles">
      <span slot="no-more"></span>
    </infinite-loading>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';

import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';

@Component({
  components: {
    SongCollectionList,
    InfiniteLoading
  }
})
export default class SearchViewAll extends Vue {
  private offset = 0;
  private fetchLimit = 20;
  private hasNext = true;
  private data: any[] = [];
  private idSet = new Set<string>();

  created() {
    const typeSet = new Set(['albums', 'playlists', 'songs', 'artists']);
    if (!typeSet.has(this.$route.params.type)) {
      this.$router.push({ name: 'NotFound' });
    }
  }

  infiniteHandler($state: any) {
    const query = this.$route.query.q;
    const { type } = this.$route.params;

    return musicApiService
      .searchOneResource(query, type, this.fetchLimit, this.offset)
      .then(result => {
        if (!result) {
          $state.complete();
          return;
        }
        const { data, hasNext, offset } = result;

        // The api may return duplicate results even with 'offset' provided
        // So we have to use a set to keep track of already loaded items
        data.forEach(item => {
          if (!this.idSet.has(item.id)) {
            this.data.push(item);
            this.idSet.add(item.id);
          }
        });

        this.offset = offset;
        $state.loaded();
        if (!hasNext) {
          $state.complete();
        }
      });
  }
}
</script>

<style lang="scss" scoped>
</style>
