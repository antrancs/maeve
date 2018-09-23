<template>
  <div class="artwork">
    <div class="image-wrapper">
      <img
        class="artwork-image"
        v-lazy="artworkUrl"
        alt=""
        :style="artworkImageStyle"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MediaArtwork extends Vue {
  // Props
  @Prop() artworkUrl!: string;

  @Prop({ default: false })
  isRound!: boolean;

  // Computed
  get artworkImageStyle(): object {
    return {
      'border-radius': this.isRound ? '50%' : 'none'
    };
  }
}
</script>

<style scoped lang="scss">
.artwork {
  // height: 100%;
  position: relative;
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
