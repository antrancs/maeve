<template>
  <div>
    <div class="text-xs-center">
      <v-item-group v-model="selectedGenre">
        <v-item v-for="genre in genres" :key="genre.id">
          <v-chip
            class="elevation-5"
            slot-scope="{ active, toggle }"
            :selected="active"
            :style="active ? chipActiveStyle : {}"
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
          <section-header class="ml-2">Top songs</section-header>
          <SongListLarge :songs="songs" sourceName="Top songs" />
        </template>

        <template v-if="albums.length > 0">
          <section-header class="ml-2 mt-4">Top Albums</section-header>
          <SongCollectionList :collections="albums" />
        </template>

        <template v-if="playlists.length > 0">
          <section-header class="ml-2 mt-4">Top Playlists</section-header>
          <SongCollectionList :collections="playlists" />
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import SongListLarge from '@/components/Song/SongListLarge.vue';
import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';
import { Nullable } from '@/@types/model/model';
import { GENRES } from '@/utils/constants';
import { isLight, TEXT_PRIMARY_LIGHT, TEXT_PRIMARY_DARK } from '@/themes';

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
    ...GENRES.filter(genre => genre.id !== '100') // don't include Kpop in the genre filter
  ];

  private chart: Nullable<MusicKit.ChartResponse> = null;

  get songs(): ReadonlyArray<MusicKit.Song> {
    if (!this.chart || this.chart.songs.length === 0) {
      return [];
    }

    return Object.freeze(this.chart.songs[0].data as MusicKit.Song[]);
  }

  get playlists(): ReadonlyArray<MusicKit.Playlist> {
    if (!this.chart || this.chart.playlists.length === 0) {
      return [];
    }

    return (
      Object.freeze(this.chart.playlists[0].data as MusicKit.Playlist[]) || []
    );
  }

  get albums(): ReadonlyArray<MusicKit.Album> {
    if (!this.chart || this.chart.albums.length === 0) {
      return [];
    }

    return Object.freeze(this.chart.albums[0].data as MusicKit.Album[]) || [];
  }

  get chipActiveStyle() {
    return {
      'background-color': this.$vuetify.theme.accent as string,
      color: this.chipColorStyle
    };
  }

  get chipColorStyle(): string {
    return isLight(this.$vuetify.theme.accent as string)
      ? TEXT_PRIMARY_LIGHT
      : TEXT_PRIMARY_DARK;
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
