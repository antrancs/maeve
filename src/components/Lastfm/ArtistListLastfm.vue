<template>
  <v-layout row wrap>
    <v-flex xs12 v-for="(artist, index) in artists" :key="artist.name">
      <ArtistItemFirst v-if="index === 0" :artist="artist" />
      <ArtistItem v-else :artist="artist" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import ArtistItem from './ArtistListLastfmItem.vue';
import ArtistItemFirst from './ArtistListLastfmItemFirst.vue';

@Component({
  components: { ArtistItem, ArtistItemFirst }
})
export default class ArtistListLastfm extends Vue {
  @Prop({ default: () => [] })
  artists!: any[];
}
</script>
