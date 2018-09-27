<template>
    <div>
      <section v-if="playlists.length > 0" class="content-spacing">
        <h2 class="section-title">My playlists</h2>
        <song-collection-list :collections="playlists"></song-collection-list>
      </section>
      
      <section v-if="albums.length > 0" class="content-spacing">
        <h2 class="section-title">My albums</h2>
        <song-collection-list :collections="albums"></song-collection-list>
      </section>
    </div>
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
  // Data
  private playlists: MusicKit.LibraryPlaylist[] = [];
  private albums: MusicKit.LibraryAlbum[] = [];

  // Life cycle methods
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

<style lang="scss" scoped>
</style>
