<template>
  <v-layout row wrap>
    <v-flex xs2 class="pa-2" v-for="genre in genres" :key="genre.id">
      <GenreListItem :genre="genre" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import GenreListItem from '@/components/GenreListItem.vue';
import { GENRES } from '@/utils/constants';

@Component({
  components: {
    GenreListItem
  }
})
export default class GenreList extends Vue {
  private genres = GENRES;
}
</script>
