<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="px-2">
        <section-header>{{ genreDetailName }}</section-header>
      </v-flex>

      <v-flex xs12 v-if="collections.length > 0">
        <SongCollectionList :collections="collections" />
      </v-flex>

      <v-flex xs12 v-if="songs.length > 0">
        <SongListLarge :songs="songs" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import SongListLarge from '@/components/Song/SongListLarge.vue';
import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import { Collection, Nullable } from '@/@types/model/model';
import { FETCH_MULTIPLE_SONGS_CATALOG } from '@/store/actions.type';
import { FetchMultipleSongsCatalogAction } from '@/store/types';
import { GENRES, Genre } from '@/utils/constants';
import { getGenreOneResource } from '../services/catalog.service';

@Component({
  components: {
    SongListLarge,
    SongCollectionList
  }
})
export default class GenreDetailViewAll extends Vue {
  private songs: MusicKit.Song[] = [];
  private collections: (MusicKit.Album | MusicKit.Playlist)[] = [];
  private genreDetailName!: string;

  @Prop() id!: string;
  @Prop() resource!: string;

  @Action [FETCH_MULTIPLE_SONGS_CATALOG]: FetchMultipleSongsCatalogAction;

  created() {
    this.$_fetchData();
  }

  async $_fetchData() {
    const result = await getGenreOneResource(this.id, this.resource);

    if (!result || Object.keys(result).length === 0) {
      return;
    }

    this.genreDetailName = result.name;
    if (this.resource === 'hot-tracks') {
      if (result.data.length > 0) {
        this.songs = await this.fetchMultipleSongsCatalog(result.data);
      }
    } else {
      this.collections = result.data;
    }
  }
}
</script>
