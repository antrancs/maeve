<template>
    <div>
        <h2>Search Results</h2>
        <div>
          <h3>Artists</h3>
          <song-collection-list></song-collection-list>
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
import { pick } from 'lodash';

import SongCollectionList from './../components/SongCollectionList.vue';

const MediaType = {
  artists: 'artists',
  albums: 'albums',
  songs: 'songs',
  playlists: 'playlists'
};

export default {
  name: 'SearchResults',

  components: {
    SongCollectionList
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

        this.albums = this.extractSearchData(result, MediaType.albums, [
          'artistName',
          'artwork',
          'contentRating',
          'editorialNotes',
          'name',
          'playParams',
          'releaseDate',
          'trackCount'
        ]);

        this.songs = this.extractSearchData(result, MediaType.songs, [
          'albumName',
          'artistName',
          'artwork',
          'contentRating',
          'durationInMillis',
          'name',
          'releaseDate'
        ]);

        this.artists = this.extractSearchData(result, MediaType.artists, [
          'name',
          'url'
        ]);

        this.playlists = this.extractSearchData(result, MediaType.playlists, [
          'artwork',
          'description',
          'curatorName',
          'name'
        ]);
      });
  },

  methods: {
    /**
     * Extract the data of the desired content (artists/songs/albums/playlists)
     * from the result object
     * @param {Object} result - The result object returned from MusicKit search API
     * @param {MediaType} field - 1 one the 4 media types
     * @param {Array<String>} wantedAttributes - Properties you want to extract.
     *     Default empty (return ALL properties)
     *  @returns {Array<Object>} - Array of media items (songs/albums/artists/playlists)
     */
    extractSearchData(result, field, wantedAttributes = []) {
      if (!result[field] || !result[field].data) {
        return [];
      }

      const items = result[field].data || [];
      return items.map(({ id, attributes, type }) => {
        const properties =
          wantedAttributes.length === 0
            ? attributes
            : pick(attributes, wantedAttributes);

        return {
          id,
          type,
          ...properties
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

