<template>
  <transition-group name="list" tag="div" class="layout row wrap">
    <ArtistItem v-for="artist in artists" :key="artist.id" :artist="artist" />
  </transition-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Artist } from '@/@types/model/model';
import ArtistItem from '@/components/ArtistItem.vue';

@Component({
  components: { ArtistItem }
})
export default class ArtistList extends Vue {
  @Prop({ default: () => [] })
  artists!: Artist[];
}
</script>
