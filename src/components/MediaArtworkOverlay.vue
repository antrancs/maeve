<template>
  <div :class="[{'artwork-overlay--active': isActive}, 'artwork-overlay']">
    <div v-if="showBackground" class="artwork-overlay__background"></div>
    <div class="content">
      <div class="content-wrapper">
        <div
          class="playing-control"
          @mouseover="playingControlHovered = true"
          @mouseout="playingControlHovered = false"
          @click="$emit('playingControlClicked')"
        >
          <icon color="#fff" :name="contentIcon"></icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import 'vue-awesome/icons/play';
import 'vue-awesome/icons/pause';
import 'vue-awesome/icons/headphones';

@Component
export default class ArtworkOverlay extends Vue {
  private playingControlHovered: boolean = false;

  @Prop({ default: true })
  private showBackground!: boolean;
  @Prop({ default: false })
  private isActive!: boolean;
  @Prop({ default: false })
  private isPlaying!: boolean;

  get contentIcon(): string {
    if (this.isPlaying && this.isActive) {
      return this.playingControlHovered ? 'pause' : 'headphones';
    }
    return 'play';
  }
}
</script>

<style scoped lang="scss">
.artwork-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  display: none;
}

.artwork-overlay__background {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.song-item:hover .artwork-overlay {
  display: block;
}

.artwork-overlay--active {
  display: block;
}

.playing-control {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
