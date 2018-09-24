<template>
  <div>
    <h2>Search Results</h2>
    <section
      class="content-spacing"
      v-if="artists.length > 0"
    >
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

    <section
      class="content-spacing"
      v-if="songs.length > 0"
    >
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

    <section
      class="content-spacing"
      v-if="albums.length > 0"
    >
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

    <section
      class="content-spacing"
      v-if="playlists.length > 0"
    >
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
import { Component, Prop, Vue, Watch, Provide } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { Route } from 'vue-router';

import SongCollectionList from '@/components/SongCollectionList.vue';
import SongList from '@/components/SongList.vue';
import ArtistList from '@/components/ArtistList.vue';
import musicApiService from '@/services/musicApi.service';
import { PLAY_SONGS } from '@/store/actions.type';
import { HandleSongClicked } from '@/@types/model/model';
import { PlaySongsAction } from '@/store/types';

@Component({
  components: {
    SongCollectionList,
    ArtistList,
    SongList
  }
})
export default class SearchResults extends Vue {
  // Data
  private albums: MusicKit.Album[] = [];
  private songs: MusicKit.Song[] = [];
  private artists: MusicKit.Artist[] = [];
  private playlists: MusicKit.Playlist[] = [];
  private queryString = '';

  // Action
  @Action [PLAY_SONGS]: PlaySongsAction;

  // Provide/Inject
  @Provide() handleSongClicked: HandleSongClicked = this.$_playAllSongs;

  // Watch
  @Watch('$route')
  onRouteChange(to: Route, from: Route, next: () => void) {
    this.queryString = to.query.q;
    this.$_search();
  }

  // Life cycle methods
  created() {
    this.queryString = this.$route.query.q;
    this.$_search();
  }

  // Methods
  /**
   * Get a subset of a collection
   */
  getFirstNResults(collections: any[], count: number) {
    return collections.slice(0, count);
  }

  // Helper methods
  /**
   * Play all songs returned from the search, starting with the selected song
   * @param index Index of the selected song
   * @param songId Id of the selected song
   */
  private $_playAllSongs(index: number, songId: string) {
    // Make the selected song the first song in the queue
    const songIds = [
      songId,
      ...this.songs.filter(song => song.id !== songId).map(song => song.id)
    ];

    this.playSongs({
      ids: songIds
    });
  }

  private $_search() {
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
        // @ts-ignore
        this.$toasted.global.error();
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
  color: white;
  margin-right: 1.5%;
  text-decoration: none;
}
</style>
