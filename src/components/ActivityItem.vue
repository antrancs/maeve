<template>
  <div class="media-column">
    <router-link :to="{ name: 'activities', params: { id: activity.id }}">
      <img
        v-lazy="artworkUrl"
        alt=""
        class="artwork"
      />
    </router-link>

    <h3>{{ activity.attributes.name }}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getArtworkUrl } from '@/utils/utils';

@Component
export default class ActivityItem extends Vue {
  // Props
  @Prop() activity!: MusicKit.Activity;

  // Life cycle methods
  created() {}

  // Computed
  get artworkUrl(): string {
    if (!this.activity.attributes) {
      return '';
    }

    return getArtworkUrl(this.activity.attributes.artwork.url, 300, 300);
  }
}
</script>

<style lang="scss" scoped>
</style>
