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
        <template v-slot:hoverRightIndex="{ hover }">
          <v-icon
            v-if="index > 0"
            @click="$emit('remove-from-queue', index)"
            color="red"
            >remove_circle</v-icon
          >
          <div v-else></div>
        </template>
      </SongListSmallItem>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';

import SongListSmallItem from '@/components/Song/SongListSmallItem.vue';
import SongListMixin from '@/mixins/SongListMixin';
import { SHOW_MEDIA_ACTION_MENU } from '../../store/actions.type';

export default Vue.extend({
  mixins: [SongListMixin],
  components: {
    SongListSmallItem
  },
  props: {
    songs: {
      type: Array as () => Array<MusicKit.MediaItem>
    }
  },
  methods: {
    handleActionIconClick(
      song: MusicKit.MediaItem,
      posX: number,
      posY: number
    ) {
      this.$store.dispatch(SHOW_MEDIA_ACTION_MENU, {
        posX,
        posY,
        isQueue: true,
        item: song
      });
    }
  }
});
</script>
