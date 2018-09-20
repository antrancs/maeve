<template>
<div>
  <div class="artist-info">
    {{ info.name }}
  </div>
  <h3>Albums</h3>
  <song-collection-list :collections="albums"></song-collection-list>

  <h3>Playlists</h3>
  <song-collection-list :collections="playlists"></song-collection-list>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';

@Component({
  components: { SongCollectionList }
})
export default class ArtistDetail extends Vue {
  // Data
  private info: object = {};
  private albums: MusicKit.Album[] = [];
  private playlists: MusicKit.Playlist[] = [];

  // Life cycle methods
  created() {
    this.$_getArtistInfo();
  }

  // Helper methods
  $_getArtistInfo() {
    const artistId = this.$route.params.id;
    musicApiService
      .getArtist(artistId)
      .then(({ name, albums, playlists }) => {
        this.info = { name };
        this.albums = albums;
        this.playlists = playlists;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
</script>

<style lang="scss" scoped>
</style>

