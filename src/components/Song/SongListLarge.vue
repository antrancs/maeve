<template>
  <v-layout column>
    <v-flex xs12>
      <SongListLargeItem
        :key="`${song.id}-${index}`"
        v-for="(song, index) in songs"
        :song="song"
        :index="index"
        :is-from-album="fromAlbum"
        @song-item-clicked="handleSongClicked"
        @actions-icon-click="handleActionIconClick"
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';

import SongListLargeItem from './SongListLargeItem.vue';
import SongListMixin from '@/mixins/SongListMixin';

@Component({
  components: { SongListLargeItem }
})
export default class SongListLarge extends Mixins(SongListMixin) {}
</script>
