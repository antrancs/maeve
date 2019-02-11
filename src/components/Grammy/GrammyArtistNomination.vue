<template>
  <v-layout row wrap v-if="artists.length > 0">
    <v-flex xs12 key="title">
      <h2 class="px-2">{{ title }}</h2>
    </v-flex>
    <transition-group
      name="list"
      tag="div"
      class="layout row wrap"
      v-if="artists.length > 0"
    >
      <ArtistItem v-for="artist in artists" :key="artist.id" :artist="artist">
        <v-icon
          v-if="winners.includes(artist.id)"
          color="accent"
          medium
          title="Winner"
          >star</v-icon
        >
      </ArtistItem>
    </transition-group>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import ArtistItem from '@/components/ArtistItem.vue';
import { FETCH_MULTIPLE_ARTISTS_CATALOG } from '@/store/actions.type';
import { FetchMultipleArtitsCatalogAction } from '@/store/types';

@Component({
  components: {
    ArtistItem
  }
})
export default class GrammyArtistNomination extends Vue {
  private artists: MusicKit.Artist[] = [];

  @Prop() title!: string;
  @Prop() artistIds!: string[];
  @Prop() winners!: string[];

  @Action [FETCH_MULTIPLE_ARTISTS_CATALOG]: FetchMultipleArtitsCatalogAction;

  created() {
    this.$_searchArtists();
  }

  async $_searchArtists() {
    this.artists = await this.fetchMultipleArtistsCatalog(this.artistIds);
  }
}
</script>
