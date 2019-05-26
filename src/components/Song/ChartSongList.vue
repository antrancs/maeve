<template>
  <v-layout column>
    <v-flex xs12>
      <SongListSmallItem
        :key="`${song.id}-${index}`"
        v-for="(song, index) in songs"
        :song="song"
        :index="index"
        :fromAlbum="fromAlbum"
        :isMusicPlaying="musicPlayer.isPlaying"
        :isActive="isSongActive(song)"
        @song-item-clicked="handleSongClicked"
        @actions-icon-click="handleActionIconClick"
        @go-to-album-page="goToAlbumPage"
        @go-to-artist-page="goToArtistPage"
      >
        <template v-slot:leftIndex>
          <div class="left-index">{{ index + 1 }}</div>
        </template>
      </SongListSmallItem>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import SongListSmallItem from './SongListSmallItem.vue';
import SongListMixin from '@/mixins/SongListMixin';

export default {
  components: {
    SongListSmallItem
  },
  mixins: [SongListMixin]
};
</script>

<style lang="scss" scoped>
.left-index {
  width: 3.2rem;
  font-weight: bold;
  color: white;
}
</style>
