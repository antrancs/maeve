<template>
  <transition name="list">
    <v-layout v-if="genres.length > 0" row wrap>
      <v-flex xs6 sm3 md2 class="pa-2" v-for="genre in genres" :key="genre.id">
        <GenreListItem :genre="genre" />
      </v-flex>
    </v-layout>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import GenreListItem from '@/components/GenreListItem.vue';
import { GENRES, Genre } from '@/utils/constants';
import { setTimeout } from 'timers';

@Component({
  components: {
    GenreListItem
  }
})
export default class GenreList extends Vue {
  private genres: Genre[] = [];

  created() {
    setTimeout(() => {
      this.genres = GENRES;
    }, 10);
  }
}
</script>
