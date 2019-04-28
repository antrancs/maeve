<template>
  <transition name="list">
    <v-layout v-if="genres.length > 0" row wrap>
      <v-flex
        xs6
        sm3
        md3
        lg2
        class="pa-2"
        v-for="genre in genres"
        :key="genre.id"
      >
        <GenreListItem :genre="genre" />
      </v-flex>
    </v-layout>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import GenreListItem from '@/components/GenreListItem.vue';
import { setTimeout } from 'timers';
import { GenreItem } from '../@types/model/model';

@Component({
  components: {
    GenreListItem
  }
})
export default class GenreList extends Vue {
  @Prop({ default: [] }) genres!: GenreItem[];
}
</script>
