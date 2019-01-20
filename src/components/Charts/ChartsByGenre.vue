<template>
  <div>
    <div class="text-xs-center">
      <v-item-group active-class="selected-genre" v-model="selectedGenre">
        <v-item v-for="genre in genres" :key="genre.id">
          <v-chip
            class="elevation-5"
            slot-scope="{ active, toggle }"
            :selected="active"
            @click="toggle"
          >
            {{ genre.name }}
          </v-chip>
        </v-item>
      </v-item-group>
    </div>

    <transition name="fade" mode="out-in">
      <div>
        <template v-if="songs.length > 0">
          <h2 class="ml-1">Top songs</h2>
          <SongListLarge :tracks="songs" />
        </template>

        <template v-if="albums.length > 0">
          <h2 class="ml-2 mt-4 mb-1">Top Albums</h2>
          <SongCollectionList :collections="albums" />
        </template>

        <template v-if="playlists.length > 0">
          <h2 class="ml-2 mt-4 mb-1">Top Playlists</h2>
          <SongCollectionList :collections="playlists" />
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import SongListLarge from '@/components/SongListLarge.vue';
import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';
import { Nullable } from '@/@types/model/model';
import { GENRES } from '@/utils/constants';

@Component({
  components: {
    SongListLarge,
    SongCollectionList
  }
})
export default class ChartsByGenre extends Vue {
  private selectedGenre = 0;
  private genres = [
    {
      id: '0',
      name: 'All'
    },
    ...GENRES
  ];

  private chart: Nullable<MusicKit.ChartResponse> = null;

  get songs(): MusicKit.Song[] {
    if (!this.chart || this.chart.songs.length === 0) {
      return [];
    }

    return this.chart.songs[0].data as MusicKit.Song[];
  }

  get playlists(): MusicKit.Playlist[] {
    if (!this.chart || this.chart.playlists.length === 0) {
      return [];
    }

    return (this.chart.playlists[0].data as MusicKit.Playlist[]) || [];
  }

  get albums(): MusicKit.Album[] {
    if (!this.chart || this.chart.albums.length === 0) {
      return [];
    }

    return (this.chart.albums[0].data as MusicKit.Album[]) || [];
  }

  @Watch('selectedGenre')
  onGenreChanged(newValue: number) {
    const genreId = this.genres[newValue].id;
    this.$_fetchChart(genreId);
  }

  created() {
    // fetch charts for all genres
    this.$_fetchChart('0');
  }

  $_fetchChart(genreId: string) {
    this.chart = null;

    let limit = 10;

    if (this.$vuetify.breakpoint.name === 'xs') {
      // fetch just 5 items on mobile
      limit = 5;
    }
    musicApiService
      .getCharts(
        ['albums', 'songs', 'playlists'],
        limit,
        genreId !== '0' ? genreId : undefined
      )
      .then(chart => (this.chart = chart));
  }
}
</script>

<style lang="scss" scoped>
.selected-genre {
  background-color: var(--v-accent-base);
  color: white;
}
</style>
