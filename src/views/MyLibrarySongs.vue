<template>
  <v-container class="page-content">
    <v-layout row wrap>
      <v-flex xs8>
        <h1 class="page-title">My songs</h1>
      </v-flex>
      <v-flex xs4 v-if="!loading && songs.length > 0" style="text-align: right">
        <app-button class="ml-0" @on-click="handlePlaySongs">Play</app-button>
        <app-button @on-click="() => handlePlaySongs(0, true)"
          >Shuffle</app-button
        >
      </v-flex>
      <v-flex xs12>
        <p v-if="loading && songs.length > 0">
          Fetching {{ songs.length }} songs
        </p>
        <v-progress-circular
          v-else-if="loading && songs.length === 0"
          indeterminate
          color="accent"
        ></v-progress-circular>
        <h4 v-else>{{ songs.length }} songs</h4>
      </v-flex>
      <v-flex class="mt-3" v-if="songs.length > 0">
        <LibrarySongs :songs="songs" @play-songs="handlePlaySongs" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import DataLoadingMixin from '@/mixins/DataLoadingMixin';
import LibrarySongs from '@/components/Song/LibrarySongs.vue';
import { FETCH_LIBRARY_SONGS, PLAY_SONGS } from '../store/actions.type';
import { FetchLibrarySongsActions, PlaySongsAction } from '../store/types';

@Component({
  components: {
    LibrarySongs
  }
})
export default class MyLibrarySongs extends Mixins(DataLoadingMixin) {
  private songs: MusicKit.LibrarySong[] = [];
  private loading = false;
  private searchOffset = 0;

  @Action [FETCH_LIBRARY_SONGS]: FetchLibrarySongsActions;
  @Action
  [PLAY_SONGS]: PlaySongsAction;

  created() {
    this.dataLoadingDone();
    this.$_fetchSongs();
  }

  async $_fetchSongs() {
    this.loading = true;
    const limit = 100;
    for (;;) {
      const result = await this.fetchLibrarySongs({
        offset: this.searchOffset,
        limit
      });

      this.songs.push(...result.data);

      if (result.hasNoData || !result.hasNext) {
        break;
      }

      this.searchOffset += limit;
    }

    this.loading = false;
  }

  handlePlaySongs(startPosition: number = 0, shuffle: boolean = false) {
    this.playSongs({
      songs: this.songs,
      shuffle,
      startPosition,
      sourceInfo: {
        name: 'Library songs',
        path: {
          name: 'myLibrarySongs'
        }
      }
    });
  }
}
</script>
