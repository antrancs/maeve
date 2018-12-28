<template>
  <v-container
    fluid
    :class="{
      'grid-list-lg': $vuetify.breakpoint.mdAndUp,
      'grid-list-md': $vuetify.breakpoint.mdAndDown
    }"
  >
    <v-layout row wrap>
      <template v-if="playlists.length > 0">
        <v-flex xs12> <h2 class="section-title">My playlists</h2> </v-flex>

        <v-flex xs12> <SongCollectionList :collections="playlists" /> </v-flex>
      </template>

      <template v-if="albums.length > 0">
        <v-flex xs12> <h2 class="section-title">My albums</h2> </v-flex>
        <v-flex xs12> <SongCollectionList :collections="albums" /> </v-flex>
      </template>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';

@Component({
  components: {
    SongCollectionList
  }
})
export default class YourLibrary extends Vue {
  private playlists: MusicKit.LibraryPlaylist[] = [];
  private albums: MusicKit.LibraryAlbum[] = [];

  created() {
    musicApiService.getLibraryPlaylists().then(playlists => {
      this.playlists = playlists;
    });

    musicApiService.getLibraryAlbums().then(albums => {
      this.albums = albums;
    });
  }
}
</script>

<style lang="scss" scoped></style>
