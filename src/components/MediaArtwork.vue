<template>
  <div class="artwork">
    <div class="image-wrapper">
      <img class="artwork-image" :src="artworkUrl" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MediaArtwork extends Vue {
  // Props
  @Prop() artworkUrl!: string;
}
</script>

<style scoped lang="scss">
.artwork {
  height: 100%;
  position: absolute;
  overflow: hidden;
  width: 100%;
}

.image-wrapper {
  align-items: center;
  display: flex;
  height: 100;
  width: 100%;
}

.artwork-image {
  height: 100%;
  width: 100%;
}
</style>
