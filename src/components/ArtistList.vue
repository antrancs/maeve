<template>
  <div style="display: flex">
    <artist-item
      v-for="artist in artists"
      :key="artist.id"
      :artist="artist">
    </artist-item>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Artist } from '@/@types/model/model';
import ArtistItem from './ArtistItem.vue';

@Component({
  components: { ArtistItem }
})
export default class ArtistList extends Vue {
  @Prop() artists!: Artist[];
}
</script>

<style lang="scss" scoped>
</style>
