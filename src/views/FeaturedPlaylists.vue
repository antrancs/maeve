<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="px-2">
        <section-header>Featured Playlists</section-header>
      </v-flex>
      <SongCollectionList :collections="playlists" />

      <v-flex class="text-xs-center" v-if="playlists.length === 0">
        <v-progress-circular indeterminate color="accent"></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import { FETCH_MULTIPLE_PLAYLISTS_CATALOG } from '@/store/actions.type';
import { FetchMultiplePlaylistsCatalogAction } from '@/store/types';
import { getFeaturedPlaylists } from '../services/catalog.service';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';

@Component({
  components: {
    SongCollectionList
  }
})
export default class FeaturedPlaylists extends Mixins(DataLoadingMixin) {
  private playlists: MusicKit.Playlist[] = [];

  created() {
    this.$_fetchPlaylists();
  }

  async $_fetchPlaylists() {
    this.playlists = await getFeaturedPlaylists();
    this.dataLoadingDone();
  }
}
</script>
