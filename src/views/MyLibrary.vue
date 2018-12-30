<template>
  <v-container fluid>
    <v-layout row wrap>
      <template v-if="playlists">
        <v-flex xs12> <h2 class="section-title">My playlists</h2> </v-flex>

        <v-flex xs12>
          <SongCollectionList
            v-if="playlists.length > 0"
            :collections="playlists"
          />

          <div v-else>You don't have any playlists</div>
        </v-flex>
      </template>

      <template v-if="albums">
        <v-flex xs12> <h2 class="section-title">My albums</h2> </v-flex>
        <v-flex>
          <SongCollectionList v-if="albums.length > 0" :collections="albums" />

          <div v-else>You don't have any albums</div>
        </v-flex>
      </template>

      <template v-if="songs">
        <v-flex xs12> <h2 class="section-title">My songs</h2> </v-flex>
        <v-flex>
          <SongList
            v-if="songs.length > 0"
            :tracks="songs"
            :isFromLibrary="true"
          />

          <div v-else>You don't have any albums</div>
        </v-flex>
      </template>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import SongList from '@/components/SongList.vue';
import musicApiService from '@/services/musicApi.service';
import { Action } from 'vuex-class';
import { Nullable } from '@/@types/model/model';
import { Route } from 'vue-router';
import {
  FETCH_LIBRARY_SONGS,
  FETCH_LIBRARY_ALBUMS,
  FETCH_LIBRARY_PLAYLISTS
} from '@/store/actions.type';

@Component({
  components: {
    SongCollectionList,
    SongList
  }
})
export default class YourLibrary extends Vue {
  private playlists: Nullable<MusicKit.LibraryPlaylist[]> = null;
  private albums: Nullable<MusicKit.LibraryAlbum[]> = null;
  private songs: Nullable<MusicKit.LibrarySong[]> = null;

  @Prop() resource!: string;

  @Action [FETCH_LIBRARY_ALBUMS]: () => Promise<MusicKit.LibraryAlbum[]>;
  @Action [FETCH_LIBRARY_PLAYLISTS]: () => Promise<MusicKit.LibraryPlaylist[]>;
  @Action [FETCH_LIBRARY_SONGS]: () => Promise<MusicKit.LibrarySong[]>;

  created() {
    this.$_fetchResource();
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.playlists = null;
    this.albums = null;
    this.songs = null;
    this.$_fetchResource();
  }

  $_fetchResource() {
    switch (this.resource) {
      case 'albums':
        this.fetchLibraryAlbums().then(albums => (this.albums = albums));
        break;

      case 'playlists':
        this.fetchLibraryPlaylists().then(
          playlists => (this.playlists = playlists)
        );
        break;

      case 'songs':
        this.fetchLibrarySongs().then(songs => (this.songs = songs));
    }
  }
}
</script>
