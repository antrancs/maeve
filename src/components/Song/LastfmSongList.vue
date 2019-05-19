<template>
  <v-layout column>
    <v-flex xs12>
      <SongListSmallItem
        :key="`${song.id}-${index}`"
        v-for="(song, index) in songs"
        :song="song"
        :index="index"
        :isMusicPlaying="musicPlayer.isPlaying"
        :isActive="isSongActive(song)"
        @song-item-clicked="handleSongClicked"
        @actions-icon-click="handleActionIconClick"
        @go-to-album-page="goToAlbumPage"
        @go-to-artist-page="goToArtistPage"
      >
        <template v-slot:rightIndex>
          <div :class="$style['right-index']">
            {{ getLastfmStreamDate(song) }}
          </div>
        </template>
      </SongListSmallItem>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import SongListSmallItem from './SongListSmallItem.vue';
import SongListMixin from '@/mixins/SongListMixin';
import { LastfmSong } from '../../@types/model/model';

export default Vue.extend({
  mixins: [SongListMixin],
  props: {
    songs: {
      type: Array as () => Array<LastfmSong>
    }
  },
  components: {
    SongListSmallItem
  },
  methods: {
    getLastfmStreamDate(song: LastfmSong): string {
      return distanceInWordsToNow(Date.parse(song.lastStream + ' UTC'));
    }
  }
});
</script>

<style lang="scss" module>
.right-index {
  width: 7.5rem;
}
</style>
