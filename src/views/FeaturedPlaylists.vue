<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="px-2"> <h2>Featured Playlists</h2> </v-flex>
      <SongCollectionList :collections="playlists" />

      <v-flex class="text-xs-center" v-if="!shouldLoad && !noMoreData">
        <v-progress-circular indeterminate color="accent"></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import SongCollectionList from '@/components/SongCollectionList.vue';
import { FETCH_MULTIPLE_PLAYLISTS_CATALOG } from '@/store/actions.type';
import { FetchMultiplePlaylistsCatalogAction } from '@/store/types';
import InfiniteScrollMixin from '@/mixins/InfiniteScrollMixin';
import { getFeaturedPlaylists } from '@/utils/utils';

@Component({
  components: {
    SongCollectionList
  }
})
export default class FeaturedPlaylists extends Mixins(InfiniteScrollMixin) {
  private offset = 0;
  private fetchLimit = 15;
  private playlists: MusicKit.Playlist[] = [];

  @Action
  [FETCH_MULTIPLE_PLAYLISTS_CATALOG]: FetchMultiplePlaylistsCatalogAction;

  created() {
    this.$_fetchPlaylists();
  }

  handleScroll() {
    this.$_fetchPlaylists();
  }

  async $_fetchPlaylists() {
    this.shouldLoad = false;
    const playlistIds = (await getFeaturedPlaylists(
      this.offset,
      this.fetchLimit
    )) as string[];

    const playlists = await this.fetchMultiplePlaylistsCatalog(playlistIds);

    this.playlists.push(...playlists);

    const hasNext = playlistIds.length === this.fetchLimit;
    if (!hasNext) {
      this.shouldLoad = false;
      this.noMoreData = true;
    }

    this.offset += this.fetchLimit;
    this.shouldLoad = true;
  }
}
</script>
