<template>
    <div class="content-spacing">
      <h2>Search Results</h2>
      <section>
        <div class="section-header">
          <h3>Artists</h3>
          <router-link
            v-if="artists.length > 5"
            :to="{ name: 'searchViewAll', params: { type: 'artists' }, query: { q: queryString } }"
            class="section-header__view-all"
          >
            View all
          </router-link>
        </div>
        <artist-list :artists="getFirstNResults(artists, 5)">
        </artist-list>
      </section>

      <section>
        <div class="section-header">
          <h3>Songs</h3>
          <router-link
            v-if="songs.length > 5"
            :to="{ name: 'searchViewAll', params: { type: 'songs' }, query: { q: queryString } }"
            class="section-header__view-all"
          >
            View all
          </router-link>
        </div>
        <song-list :tracks="getFirstNResults(songs, 5)"></song-list>
      </section>

      <section>
        <div class="section-header">
          <h3>Albums</h3>
          <router-link
            v-if="albums.length > 10"
            :to="{ name: 'searchViewAll', params: { type: 'albums' }, query: { q: queryString } }"
            class="section-header__view-all"
          >
            View all
          </router-link>
        </div>
        <song-collection-list :collections="getFirstNResults(albums, 10)"></song-collection-list>
      </section>

      <section>
        <div class="section-header">
          <h3>Playlists</h3>
          <router-link
            v-if="playlists.length > 10"
            :to="{ name: 'searchViewAll', params: { type: 'playlists' }, query: { q: queryString } }"
            class="section-header__view-all"
          >
            View all
          </router-link>
        </div>
        <song-collection-list :collections="getFirstNResults(playlists, 10)"></song-collection-list>
      </section>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import SongList from '@/components/SongList.vue';
import ArtistList from '@/components/ArtistList.vue';
import musicApiService from '@/services/musicApi.service';
import { Route } from 'vue-router';

@Component({
  components: {
    SongCollectionList,
    ArtistList,
    SongList
  }
})
export default class SearchResults extends Vue {
  private albums: any[] = [];
  private songs: any[] = [];
  private artists: any[] = [];
  private playlists: any[] = [];
  private queryString = '';

  @Watch('$route')
  onRouteChange(to: Route, from: Route, next: () => void) {
    this.queryString = to.query.q;
    this.search();
  }

  created() {
    this.queryString = this.$route.query.q;
    this.search();
  }

  search() {
    musicApiService
      .searchAll(this.queryString)
      .then(result => {
        if (!result) {
          // TODO: display no results found
          return;
        }
        const { albums, songs, artists, playlists } = result;
        this.albums = albums;
        this.songs = songs;
        this.artists = artists;
        this.playlists = playlists;
      })
      .catch(err => {
        console.log(err);
      });
  }

  getFirstNResults(collections: any[], count: number) {
    return collections.slice(0, count);
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
  color: white;
  margin-right: 1.5%;
  text-decoration: none;
}
</style>
