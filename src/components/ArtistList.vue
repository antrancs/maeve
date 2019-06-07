<template>
  <transition-group
    name="list"
    tag="div"
    class="layout row wrap section-offset"
  >
    <v-flex
      v-bind="itemSizeAttributes"
      v-for="artist in artists"
      :key="artist.id"
      class="px-2 pb-3"
    >
      <ArtistItem :artist="artist" />
    </v-flex>
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

  @Prop({ default: () => ['xs6', 'sm3', 'md3', 'lg2'] })
  itemSizes!: string[];

  get itemSizeAttributes() {
    const attrs = this.itemSizes.reduce((acc: any, current) => {
      acc[current] = true;
      return acc;
    }, {});

    return attrs;
  }
}
</script>
