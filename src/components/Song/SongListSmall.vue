<template>
  <v-layout column>
    <v-flex xs12>
      <SongListSmallItem
        :key="`${song.id}-${index}`"
        v-for="(song, index) in songs"
        :song="song"
        :index="index"
        :isChart="isChart"
        :textColor="textColor"
        :is-from-album="fromAlbum"
        @song-item-clicked="handleSongClicked"
        @actions-icon-click="handleActionIconClick"
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

import { Nullable } from '@/@types/model/model';
import { SkipToSongAtIndexAction } from '@/store/types';

import SongListSmallItem from './SongListSmallItem.vue';
import SongListMixin from '@/mixins/SongListMixin';
import { SKIP_TO_SONG_AT_INDEX } from '@/store/actions.type';

@Component({
  components: { SongListSmallItem }
})
export default class SongListSmall extends Mixins(SongListMixin) {
  @Prop() textColor!: Nullable<string>;

  @Action
  [SKIP_TO_SONG_AT_INDEX]: SkipToSongAtIndexAction;
}
</script>
