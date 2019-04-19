<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="px-2" v-if="genre">
        <section-header>{{ genre.name }} - {{ resourceText }}</section-header>
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

import SongListLarge from '@/components/Song/SongListLarge.vue';
import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import { Collection, Nullable } from '@/@types/model/model';
import { Prop } from 'vue-property-decorator';
import { getGenreOneResource } from '@/utils/utils';
import { Action } from 'vuex-class';
import { FETCH_MULTIPLE_SONGS_CATALOG } from '@/store/actions.type';
import { FetchMultipleSongsCatalogAction } from '@/store/types';
import { GENRES, Genre } from '@/utils/constants';

@Component({
  components: {
    SongListLarge,
    SongCollectionList
  }
})
export default class GenreDetailViewAll extends Vue {
  private genre: Nullable<Genre> = null;
  private songs: MusicKit.Song[] = [];
  private collections: (MusicKit.Album | MusicKit.Playlist)[] = [];

  @Prop() id!: string;
  @Prop() resource!: string;

  @Action [FETCH_MULTIPLE_SONGS_CATALOG]: FetchMultipleSongsCatalogAction;

  get resourceText() {
    switch (this.resource) {
      case 'new-releases':
        return 'New Releases';
      case 'essential-albums':
        return 'Essential Albums';
      case 'artist-playlists':
        return 'Artist Playlists';
      case 'hot-tracks':
        return 'Hot Tracks';
      case 'playlists':
        return 'Playlists';
      default:
        return null;
    }
  }

  created() {
    const genre = GENRES.find(genre => genre.id === this.id);

    if (!genre) {
      this.$router.push({ name: 'NotFound' });
      return;
    }
    this.genre = genre;

    this.$_fetchData();
  }

  async $_fetchData() {
    if (!this.resourceText) {
      return;
    }
    const result = await getGenreOneResource(this.id, this.resource);
    if (this.resource === 'hot-tracks') {
      if (result.length > 0) {
        this.songs = await this.fetchMultipleSongsCatalog(result);
      }
    } else {
      this.collections = result;
    }
  }
}
</script>
