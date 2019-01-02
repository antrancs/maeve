<template>
  <v-flex xs6 sm3 md2 class="pa-2">
    <router-link :to="{ name: 'activities', params: { id: activity.id } }">
      <div :class="$style['wrapper']" :style="wrapperStyle">
        <MediaArtwork
          :artwork="this.activity.attributes.artwork"
          :width="300"
          :height="300"
          class="elevation-8"
        />
        <div :class="$style['activity-name']">
          <h2>{{ activity.attributes.name }}</h2>
        </div>
      </div>
    </router-link>
  </v-flex>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import MediaArtwork from '@/components/MediaArtwork.vue';
import { getArtworkUrl } from '@/utils/utils';
import { lighten } from '@/themes';

@Component({
  components: {
    MediaArtwork
  }
})
export default class ActivityItem extends Vue {
  @Prop()
  activity!: MusicKit.Activity;

  get artworkBackgroundColor() {
    return this.activity.attributes!.artwork.bgColor || 'ffffff';
  }

  get wrapperStyle() {
    return {
      '--artwork-bg-color': `#${lighten(this.artworkBackgroundColor, 20)}`
    };
  }
}
</script>

<style lang="scss" module>
.wrapper::after {
  content: '';
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  // background-color: rgba(0, 0, 0, 0.2);
  background: linear-gradient(
    -45deg,
    var(--artwork-bg-color),
    rgba(0, 0, 0, 0.4)
  );
}

.wrapper {
  position: relative;
}

.activity-artwork {
  position: absolute;
}

.activity-name {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1;
}
</style>
