<template>
  <v-layout row align-content-space-between align-center>
    <v-flex class="pr-2">
      <h1 class="header-title long-text-truncated">{{ name }}</h1>
    </v-flex>

    <ShareMenu :appleMusicLink="url" class="share-icon" />
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

import ShareMenu from '@/components/ShareMenu.vue';

@Component({
  components: {
    ShareMenu
  }
})
export default class ArtistInfo extends Vue {
  @Prop() name!: string;
  @Prop() url!: string;
}
</script>

<style lang="scss" scoped>
.share-icon {
  flex-shrink: 0;
}
</style>
