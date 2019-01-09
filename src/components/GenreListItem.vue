<template>
  <router-link :to="{ name: 'genres', params: { id: genre.id } }">
    <div :style="genreBackgroundColorStyle" :class="[$style['genre']]">
      <h3>{{ genre.name }}</h3>
    </div>
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { GENRES, Genre } from '@/utils/constants';

@Component
export default class GenreListItem extends Vue {
  @Prop() genre!: Genre;

  get genreBackgroundColorStyle() {
    return {
      background: `linear-gradient(45deg, ${this.genre.colors.join(',')})`,
      'box-shadow': `0px 10px 40px -10px ${this.genre.colors[0]}`
    };
  }
}
</script>

<style lang="scss" module>
.genre {
  border-radius: 0.8rem;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6rem;
}
</style>
