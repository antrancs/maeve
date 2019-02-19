<template>
  <v-layout column v-if="songs.length > 0">
    <div :class="$style['header']">
      <h2 class="px-2">{{ title }}</h2>

      <app-button @on-click="playAllSongs">Play All</app-button>
    </div>

    <GrammySongList :songs="songs" :winners="winners" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import GrammySongList from './GrammySongList.vue';
import { Song } from '@/@types/model/model';
import {
  PLAY_SONGS,
  SEARCH_CATALOG,
  FETCH_MULTIPLE_SONGS_CATALOG
} from '@/store/actions.type';
import {
  PlaySongsAction,
  SearchCatalogAction,
  FetchResult,
  FetchMultipleSongsCatalogAction
} from '@/store/types';
import { setTimeout } from 'timers';

@Component({
  components: {
    GrammySongList
  }
})
export default class GrammySongNomination extends Vue {
  private songs: Song[] = [];

  @Prop() title!: string;
  @Prop() songIds!: string[];
  @Prop() winners!: string[];

  @Action [PLAY_SONGS]: PlaySongsAction;
  @Action [FETCH_MULTIPLE_SONGS_CATALOG]: FetchMultipleSongsCatalogAction;

  created() {
    this.$_searchSongs();
  }

  playAllSongs() {
    this.playSongs({
      songs: this.songs,
      startSongIndex: 0
    });
  }

  async $_searchSongs() {
    this.songs = await this.fetchMultipleSongsCatalog(this.songIds);
  }
}
</script>

<style lang="scss" module>
.header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
</style>
