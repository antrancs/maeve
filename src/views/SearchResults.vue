<template>
    <div>
        <h2>Search Results</h2>
        <div>
          <h3>Artists</h3>
          <artist-list :artists="artists"></artist-list>
        </div>

        <div>
          <h3>Songs</h3>
          <song-collection-list></song-collection-list>
        </div>

        <div>
          <h3>Albums</h3>
          <song-collection-list :collections="albums"></song-collection-list>
        </div>

        <div>
          <h3>Playlists</h3>
          <song-collection-list :collections="playlists"></song-collection-list>
        </div>
    </div>
</template>

<script>
import SongCollectionList from '@/components/SongCollectionList.vue';
import ArtistList from '@/components/ArtistList.vue';
import { extractSearchData } from '@/utils/utils';
import musicApiService from '@/services/musicApi.service';

export default {
  name: 'SearchResults',

  components: {
    SongCollectionList,
    ArtistList
  },

  data() {
    return {
      albums: [],
      songs: [],
      artists: [],
      playlists: []
    };
  },

  created() {
    const queryString = this.$route.query.q;

    musicApiService
      .search(queryString)
      .then(({ albums, songs, artists, playlists }) => {
        this.albums = albums;
        this.songs = songs;
        this.artists = artists;
        this.playlists = playlists;
      });
  }
};
</script>

<style lang="scss" scoped>
</style>
