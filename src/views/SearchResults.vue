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

const MediaType = {
  artists: 'artists',
  albums: 'albums',
  songs: 'songs',
  playlists: 'playlists'
};

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

    if (!this.$music) {
      return;
    }

    this.$music.api
      .search(queryString, {
        limit: 10,
        types: Object.values(MediaType).join(',')
      })
      .then(result => {
        if (Object.keys(result).length === 0) {
          return;
        }

        console.log(result);

        this.albums = extractSearchData(result, MediaType.albums, [
          'artistName',
          'artwork',
          'contentRating',
          'editorialNotes',
          'name',
          'playParams',
          'releaseDate',
          'trackCount'
        ]);

        this.songs = extractSearchData(result, MediaType.songs, [
          'albumName',
          'artistName',
          'artwork',
          'contentRating',
          'durationInMillis',
          'name',
          'releaseDate'
        ]);

        this.artists = extractSearchData(result, MediaType.artists, [
          'name',
          'url'
        ]);

        this.playlists = extractSearchData(result, MediaType.playlists, [
          'artwork',
          'description',
          'curatorName',
          'name',
          'playParams'
        ]);
      });
  },

  methods: {}
};
</script>

<style lang="scss" scoped>
</style>

