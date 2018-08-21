<template>
  <div>
    <div class="album-detail-header">
        <div class="content">
          <h2>{{ album.name }}</h2>
          <h3>{{ album.artistName }}</h3>
        </div>
        <picture class="album-detail-header--banner">
          <source
            media="(max-width: 540px)"
            :srcset="getArtworkUrl(album.artwork, 540, 540)">

          <source
            media="(max-width: 817px)"
            :srcset="getArtworkUrl(album.artwork, 817, 817)">

          <source
            media="(max-width: 1105px)"
            :srcset="getArtworkUrl(album.artwork, 1105, 1105)">

          <img
            class="image"
            :src="getArtworkUrl(album.artwork, 400, 400)"/>
        </picture>
    </div>

    <song-list :songs="tracks"></song-list>
  </div>
</template>

<script>
import { pick } from 'lodash';

import SongList from '@/components/SongList.vue';
import { extractSearchData, getArtworkUrl } from '@/utils/utils';

export default {
  name: 'AlbumDetail',

  components: {
    SongList
  },

  created() {
    const albumId = this.$route.params.id;
    this.$music.api.album(albumId, { include: 'tracks' }).then(result => {
      this.album = pick(result.attributes, [
        'artistName',
        'artwork',
        'contentRating',
        'editorialNotes.standard',
        'name',
        'playParams',
        'releaseDate',
        'trackCount'
      ]);

      console.log(result.relationships);
      this.tracks = extractSearchData(result.relationships, 'tracks', [
        'artistName',
        'artwork',
        'contentRating',
        'durationInMillis',
        'name',
        'releaseDate',
        'trackNumber'
      ]);
    });
  },

  data() {
    return {
      album: {},
      tracks: []
    };
  },

  methods: {
    getArtworkUrl(artwork, width, height) {
      return artwork ? getArtworkUrl(artwork.url, width, height) : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.album-detail-header {
  height: 350px;
  position: relative;
}

.content {
  position: relative;
  z-index: 100;
  background-color: rgba($color: (#000000), $alpha: 0.4);
  color: white;
  height: 100%;
}

.album-detail-header--banner {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
