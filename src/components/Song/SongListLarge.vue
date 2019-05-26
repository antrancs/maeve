<template>
  <v-layout column>
    <v-flex xs12>
      <SongListLargeItem
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
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import SongListLargeItem from './SongListLargeItem.vue';
import SongListMixin from '@/mixins/SongListMixin';

export default {
  mixins: [SongListMixin],
  components: {
    SongListLargeItem
  }
};
</script>
