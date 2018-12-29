<template>
  <v-flex xs6 sm3 md2 class="pa-1">
    <router-link :to="{ name: 'activities', params: { id: activity.id } }">
      <MediaArtwork
        :artwork="this.activity.attributes.artwork"
        :width="300"
        :height="300"
      />
    </router-link>

    <div class="main-info-text activity__name">
      {{ activity.attributes.name }}
    </div>
  </v-flex>
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
  @Prop()
  activity!: MusicKit.Activity;
}
</script>
