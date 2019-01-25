<template>
  <div :class="[{ 'artwork-overlay--active': isActive }, 'artwork-overlay']">
    <div v-if="showBackground" class="artwork-overlay__background"></div>
    <div class="content">
      <div class="content-wrapper">
        <button
          class="playing-control btn btn--icon"
          @mouseover="playingControlHovered = true"
          @mouseout="playingControlHovered = false"
          @click="$emit('playing-control-clicked')"
        >
          <v-icon color="white">{{ contentIcon }}</v-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

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
      return this.playingControlHovered ? 'pause' : 'headset';
    }
    return 'play_arrow';
  }
}
</script>

<style scoped lang="scss">
.artwork-overlay {
  display: none;
  height: 100%;
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
  height: 3.2rem;
  justify-content: center;
  width: 3.2rem;
}

.song-item__wrapper:hover .artwork-overlay {
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
