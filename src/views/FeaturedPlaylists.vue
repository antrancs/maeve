<template>
  <v-container class="page-content">
    <content-section>
      <template #section-header>
        Featured Playlists
      </template>

      <template #section-content>
        <SongCollectionList :collections="playlists" />
      </template>
    </content-section>

    <div class="text-xs-center" v-if="playlists.length === 0">
      <v-progress-circular indeterminate color="accent"></v-progress-circular>
    </div>
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
