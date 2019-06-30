<template>
  <v-container>
    <template v-if="hasResults">
      <content-section v-if="artists.length > 0">
        <template #section-header>
          Artists
        </template>

        <template #section-content>
          <ArtistList :artists="getFirstNResults(artists, 5)" />
        </template>
      </content-section>

      <content-section v-if="songs.length > 0">
        <template #section-header>
          Songs
        </template>

        <template #section-header-right>
          <router-link
            v-if="songs.length > 5"
            :to="{
              name: 'searchViewAll',
              params: { type: 'songs' },
              query: { q: queryString }
            }"
            class="section-header__view-all link"
            >View all</router-link
          >
        </template>

        <template #section-content>
          <SongListLarge
            :songs="getFirstNResults(songs, 5)"
            :sourceInfo="{
              name: `Search results for '${queryString}'`,
              path: {
                name: 'search',
                query: {
                  q: queryString
                }
              }
            }"
          />
        </template>
      </content-section>

      <content-section v-if="albums.length > 0">
        <template #section-header>
          Albums
        </template>

        <template #section-header-right>
          <router-link
            v-if="albums.length > 10"
            :to="{
              name: 'searchViewAll',
              params: { type: 'albums' },
              query: { q: queryString }
            }"
            class="section-header__view-all link"
            >View all</router-link
          >
        </template>

        <template #section-content>
          <SongCollectionList :collections="getFirstNResults(albums, 10)" />
        </template>
      </content-section>

      <content-section v-if="playlists.length > 0">
        <template #section-header>
          Playlists
        </template>

        <template #section-header-right>
          <router-link
            v-if="playlists.length > 10"
            :to="{
              name: 'searchViewAll',
              params: { type: 'playlists' },
              query: { q: queryString }
            }"
            class="section-header__view-all link"
            >View all</router-link
          >
        </template>

        <template #section-content>
          <SongCollectionList :collections="getFirstNResults(playlists, 10)" />
        </template>
      </content-section>
    </template>

    <h3 v-else>No results</h3>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { Route } from 'vue-router';

import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import SongListLarge from '@/components/Song/SongListLarge.vue';
import ArtistList from '@/components/ArtistList.vue';
import { PLAY_SONGS, SHOW_SNACKBAR } from '@/store/actions.type';
import { HandleSongClicked, SnackbarMode } from '@/@types/model/model';
import { PlaySongsAction, ShowSnackbarAction } from '@/store/types';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';
import { searchAll } from '../services/musicApi.service';

@Component({
  components: {
    SongCollectionList,
    ArtistList,
    SongListLarge
  }
})
export default class SearchResults extends Mixins(DataLoadingMixin) {
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
    return searchAll(this.queryString)
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
          text: 'Something went wrong.',
          type: SnackbarMode.error
        });
      })
      .finally(() => {
        this.dataLoadingDone();
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
</style>
