<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="px-2">
        <h2>All {{ this.$route.params.type }} results for '{{ query }}'</h2>
      </v-flex>
      <SongCollectionList
        v-if="type === 'albums' || type === 'playlists'"
        :collections="data"
      />

      <ArtistList v-else-if="type === 'artists'" :artists="data" />

      <SongList v-else-if="type === 'songs'" :tracks="data" />

      <infinite-loading @infinite="infiniteHandler" spinner="circles">
        <span slot="no-more"></span>
      </infinite-loading>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfiniteLoading from 'vue-infinite-loading';

import SongCollectionList from '@/components/SongCollectionList.vue';
import ArtistList from '@/components/ArtistList.vue';
import SongList from '@/components/SongList.vue';
import musicApiService from '@/services/musicApi.service';
import { HandleSongClicked } from '@/@types/model/model';
import { PLAY_SONGS } from '@/store/actions.type';
import { PlaySongsAction } from '@/store/types';

@Component({
  components: {
    SongCollectionList,
    InfiniteLoading,
    ArtistList,
    SongList
  }
})
export default class SearchViewAll extends Vue {
  private offset = 0;
  private fetchLimit = 20;
  private hasNext = true;
  private data: any[] = [];
  private idSet = new Set<string>();

  @Action [PLAY_SONGS]: PlaySongsAction;

  get query(): string {
    return this.$route.query.q as string;
  }

  get type(): string {
    return this.$route.params.type;
  }

  created() {
    const typeSet = new Set(['albums', 'playlists', 'songs', 'artists']);
    if (!typeSet.has(this.type)) {
      this.$router.push({ name: 'NotFound' });
    }
  }

  infiniteHandler($state: any) {
    // const query = this.$route.query.q;
    const { type } = this.$route.params;

    return musicApiService
      .searchOneResource(this.query, type, this.fetchLimit, this.offset)
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
        // we probably don't need to load more than 150 items
        if (!hasNext || offset > 150) {
          $state.complete();
        }
      });
  }
}
</script>
