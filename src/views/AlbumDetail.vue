<template>
  <div>
    <div class="album-detail-header">
        <div class="content">
          <h2>{{ album.name }}</h2>
          <h3>{{ album.artistName }}</h3>
          <button @click="play">Play</button>
          <button>Shuffle </button>
        </div>
        <picture class="album-detail-header__banner">
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
import { mapActions } from 'vuex';

import { PLAY_COLLECTION } from '@/store/actions.type';
import SongList from '@/components/SongList.vue';
import { getArtworkUrl } from '@/utils/utils';
import musicApiService from '@/services/musicApi.service';

export default {
  name: 'AlbumDetail',

  components: {
    SongList
  },

  created() {
    const albumId = this.$route.params.id;
    musicApiService.getAlbum(albumId).then(({ album, tracks }) => {
      this.album = album;
      this.tracks = tracks;
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
    },

    play() {
      const { id, kind } = this.album.playParams;

      this.playCollection({
        collectionId: id,
        collectionType: kind,
        atIndex: 0
      });
    },

    ...mapActions({
      playCollection: PLAY_COLLECTION
    })
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

.album-detail-header__banner {
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
