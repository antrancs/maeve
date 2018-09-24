<template>
  <div class="media-column">
    <router-link :to="{ name: 'activities', params: { id: activity.id }}">
      <media-artwork
        :artwork="this.activity.attributes.artwork"
        :width="300"
        :height="300"
      >
      </media-artwork>
    </router-link>

    <h3>{{ activity.attributes.name }}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import MediaArtwork from '@/components/MediaArtwork.vue';

@Component({
  components: {
    MediaArtwork
  }
})
export default class ActivityItem extends Vue {
  // Props
  @Prop() activity!: MusicKit.Activity;
}
</script>

<style lang="scss" scoped>
</style>
