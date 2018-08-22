<template>
<div>
  <div class="artist-info">
    {{info.name}}
  </div>
  <h3>Albums</h3>
  <song-collection-list :collections="albums"></song-collection-list>

  <h3>Playlists</h3>
  <song-collection-list :collections="playlists"></song-collection-list>
</div>
</template>

<script>
import SongCollectionList from '@/components/SongCollectionList.vue';
import musicApiService from '@/services/musicApi.service';

export default {
  name: 'ArtistDetail',

  components: {
    SongCollectionList
  },

  data() {
    return {
      info: {},
      albums: [],
      playlists: []
    };
  },

  created() {
    const artistId = this.$route.params.id;
    musicApiService.getArtist(artistId).then(({ name, albums, playlists }) => {
      this.info = { name };
      this.albums = albums;
      this.playlists = playlists;
    });
  }
};
</script>

<style lang="scss" scoped>
</style>

