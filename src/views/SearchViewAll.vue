<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="px-2">
        <h2>All {{ this.$route.params.type }} results for '{{ query }}'</h2>
      </v-flex>
      <SongCollectionList
        v-if="type === 'albums' || type === 'playlists'"
        :collections="items"
      />

      <ArtistList v-else-if="type === 'artists'" :artists="items" />

      <SongListLarge v-else-if="type === 'songs'" :tracks="items" />
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import SongCollectionList from '@/components/SongCollectionList.vue';
import ArtistList from '@/components/ArtistList.vue';
import SongListLarge from '@/components/SongListLarge.vue';
import InfiniteScrollMixin from '@/mixins/InfiniteScrollMixin';
import { HandleSongClicked } from '@/@types/model/model';
import { PLAY_SONGS, SEARCH_CATALOG } from '@/store/actions.type';
import { PlaySongsAction, SearchCatalogAction } from '@/store/types';

@Component({
  components: {
    SongCollectionList,
    ArtistList,
    SongListLarge
  }
})
export default class SearchViewAll extends Mixins(InfiniteScrollMixin) {
  private offset = 0;
  private fetchLimit = 20;
  private hasNext = true;
  private items: (
    | MusicKit.Song
    | MusicKit.Artist
    | MusicKit.Playlist
    | MusicKit.Album)[] = [];
  private hasNoData = false;

  @Action [SEARCH_CATALOG]!: SearchCatalogAction;

  get query(): string {
    return this.$route.query.q as string;
  }

  get type(): string {
    return this.$route.params.type;
  }

  created() {
    this.$_fetchData();
  }

  $_fetchData() {
    const { type } = this.$route.params;

    if (
      type !== 'albums' &&
      type !== 'playlists' &&
      type !== 'songs' &&
      type !== 'artists'
    ) {
      this.$router.push({ name: 'NotFound' });
      return;
    }

    this.shouldLoad = false;

    this.searchCatalog({
      offset: this.offset,
      limit: this.fetchLimit,
      term: this.query,
      type
    }).then(result => {
      const { data, hasNext, hasNoData, offset = 0 } = result;
      if (hasNoData) {
        this.hasNoData = true;
        return;
      }

      this.noMoreData = !hasNext;

      this.items.push(...data);

      if (!this.noMoreData) {
        this.shouldLoad = true;
      }
      this.offset = offset;

      if (!hasNext || this.offset >= 150) {
        this.shouldLoad = false;
        this.noMoreData = true;
      }
    });
  }

  handleScroll() {
    this.$_fetchData();
  }
}
</script>
