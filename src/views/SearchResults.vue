<template>
  <v-container>
    <v-layout row wrap v-if="hasResults">
      <template v-if="artists.length > 0">
        <v-flex class="section-header pa-2" xs12>
          <h3 class="section-title">Artists</h3>
          <!-- <router-link
            v-if="artists.length > 5"
            :to="{
              name: 'searchViewAll',
              params: { type: 'artists' },
              query: { q: queryString }
            }"
            class="section-header__view-all link"
            >View all</router-link
          > -->
        </v-flex>
        <ArtistList :artists="getFirstNResults(artists, 5)" />
      </template>

      <template v-if="songs.length > 0">
        <v-flex xs12 class="section-header px-2">
          <h3 class="section-title">Songs</h3>
          <!-- <router-link
            v-if="songs.length > 5"
            :to="{
              name: 'searchViewAll',
              params: { type: 'songs' },
              query: { q: queryString }
            }"
            class="section-header__view-all link"
            >View all</router-link
          > -->
        </v-flex>
        <SongList :tracks="getFirstNResults(songs, 5)" />
      </template>

      <template v-if="albums.length > 0">
        <v-flex class="section-header px-2 pt-4" xs12>
          <h3 class="section-title">Albums</h3>
          <!-- <router-link
            v-if="albums.length > 10"
            :to="{
              name: 'searchViewAll',
              params: { type: 'albums' },
              query: { q: queryString }
            }"
            class="section-header__view-all link"
            >View all</router-link
          > -->
        </v-flex>
        <SongCollectionList :collections="getFirstNResults(albums, 10)" />
      </template>

      <template v-if="playlists.length > 0">
        <v-flex xs12 class="section-header">
          <h3 class="section-title px-2 pt-4">Playlists</h3>
          <!-- <router-link
            v-if="playlists.length > 10"
            :to="{
              name: 'searchViewAll',
              params: { type: 'playlists' },
              query: { q: queryString }
            }"
            class="section-header__view-all link"
            >View all</router-link
          > -->
        </v-flex>
        <SongCollectionList :collections="getFirstNResults(playlists, 10)" />
      </template>
    </v-layout>
    <div v-else><h3>No results</h3></div>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { Route } from 'vue-router';

import SongCollectionList from '@/components/SongCollectionList.vue';
import SongList from '@/components/SongList.vue';
import ArtistList from '@/components/ArtistList.vue';
import musicApiService from '@/services/musicApi.service';
import { PLAY_SONGS, SHOW_SNACKBAR } from '@/store/actions.type';
import { HandleSongClicked } from '@/@types/model/model';
import { PlaySongsAction, ShowSnackbarAction } from '@/store/types';

@Component({
  components: {
    SongCollectionList,
    ArtistList,
    SongList
  }
})
export default class SearchResults extends Vue {
  private albums: MusicKit.Album[] = [];
  private songs: MusicKit.Song[] = [];
  private artists: MusicKit.Artist[] = [];
  private playlists: MusicKit.Playlist[] = [];
  private queryString = '';
  private hasResults = true;

  @Action [SHOW_SNACKBAR]: ShowSnackbarAction;

  // Watch
  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.queryString = to.query.q as string;
    this.$_search();
  }

  created() {
    this.queryString = this.$route.query.q as string;
    this.$_search();
  }

  // Methods
  /**
   * Get a subset of a collection
   */
  getFirstNResults(collections: any[], count: number) {
    return collections.slice(0, count);
  }

  private $_search() {
    return musicApiService
      .searchAll(this.queryString)
      .then(result => {
        if (!result) {
          // TODO: display no results found
          this.hasResults = false;
          return;
        }

        this.hasResults = true;
        const { albums, songs, artists, playlists } = result;
        this.albums = albums;
        this.songs = songs;
        this.artists = artists;
        this.playlists = playlists;
      })
      .catch(err => {
        this.showSnackbar({
          text: 'Something went wrong.'
        });
      });
  }
}
</script>

<style lang="scss" scoped>
.section-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.section-header__view-all {
  margin-right: 1.5%;
}
</style>
