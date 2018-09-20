<template>
  <div :class="[{'artwork-overlay--active': isActive}, 'artwork-overlay']">
    <div v-if="showBackground" class="artwork-overlay__background"></div>
    <div class="content">
      <div class="content-wrapper">
        <div
          class="playing-control"
          @mouseover="playingControlHovered = true"
          @mouseout="playingControlHovered = false"
          @click="$emit('playing-control-clicked')"
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
  // Data
  private playingControlHovered: boolean = false;

  // Props
  @Prop({ default: true })
  private showBackground!: boolean;
  @Prop({ default: false })
  private isActive!: boolean;
  @Prop({ default: false })
  private isPlaying!: boolean;

  // Computed
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
  display: none;
  height: 100%;
  position: absolute;
  width: 100%;
}

.artwork-overlay__background {
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.content {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.content-wrapper {
  align-items: center;
  display: flex;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.song-item:hover .artwork-overlay {
  display: block;
}

.artwork-overlay--active {
  display: block;
}

.playing-control {
  align-items: center;
  cursor: pointer;
  display: flex;
}
</style>
