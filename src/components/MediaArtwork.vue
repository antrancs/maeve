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
  @Prop() artworkUrl!: string;
}
</script>

<style scoped lang="scss">
.artwork {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100;
}

.artwork-image {
  width: 100%;
  height: 100%;
}
</style>
