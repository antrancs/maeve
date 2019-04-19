<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="px-2" v-if="resourceText">
        <section-header>{{ resourceText }}</section-header>
      </v-flex>

      <v-flex xs12 v-if="collections.length > 0">
        <SongCollectionList :collections="collections" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import { Collection, Nullable } from '@/@types/model/model';
import { Prop } from 'vue-property-decorator';
import { getBrowsePlaylists } from '@/utils/utils';
import { Action } from 'vuex-class';

@Component({
  components: {
    SongCollectionList
  }
})
export default class Browse extends Vue {
  private collections: (MusicKit.Album | MusicKit.Playlist)[] = [];

  @Prop() resource!: string;

  get resourceText() {
    switch (this.resource) {
      case 'new-music':
        return 'New Music';
      case 'replay':
        return 'Replay';
      case 'girl-power':
        return 'Girl Power';
      case 'sing-along':
        return 'Sing Along';
      default:
        return null;
    }
  }

  created() {
    this.$_fetchData();
  }

  async $_fetchData() {
    if (!this.resourceText) {
      return;
    }
    const result = await getBrowsePlaylists(this.resource);

    this.collections = result;
  }
}
</script>
