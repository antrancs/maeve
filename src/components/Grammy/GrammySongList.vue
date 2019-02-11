<template>
  <v-layout column>
    <v-flex xs12>
      <SongListLargeItem
        :key="`${index}`"
        v-for="(song, index) in songs"
        :song="song"
        :index="index"
        :is-from-album="fromAlbum"
        @song-item-clicked="handleSongClicked"
        @actions-icon-click="handleActionIconClick"
      >
        <div style="width: 3.2rem">
          <v-icon v-if="winners.includes(song.id)" title="Winner">stars</v-icon>
        </div>
      </SongListLargeItem>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

import SongListLargeItem from '@/components/SongListLargeItem.vue';
import SongListMixin from '@/mixins/SongListMixin';
import { Song } from '@/@types/model/model';

@Component({
  components: { SongListLargeItem }
})
export default class GrammySongList extends Mixins(SongListMixin) {
  @Prop() winners!: string[];

  handleActionIconClick(song: Song, posX: number, posY: number) {
    // @ts-ignore
    this.$root.$mediaActionMenu.open(song, this.collection, posX, posY, false);
  }

  handleSongClicked(songId: string, songIndex: number) {
    this.handlePlaySongs(songId);
  }
}
</script>
