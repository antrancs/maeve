<template>
  <v-layout column>
    <v-flex xs12>
      <SongListSmallItem
        :key="`${song.id}-${index}`"
        v-for="(song, index) in songs"
        :song="song"
        :index="index"
        :textColor="textColor"
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
import Vue from 'vue';

import SongListSmallItem from './SongListSmallItem.vue';
import SongListMixin from '@/mixins/SongListMixin';

export default Vue.extend({
  components: {
    SongListSmallItem
  },
  mixins: [SongListMixin]
});
</script>

<style lang="scss" scoped>
.left-index {
  width: 3.2rem;
  font-weight: bold;
  color: white;
}
</style>
