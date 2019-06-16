<template>
  <div
    title="Play"
    class="play-button"
    @click.stop="toggleCurrentTrack"
    :style="buttonStyle"
  >
    <v-icon medium :color="iconStyle">{{ songStatusIcon }}</v-icon>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import { TOGGLE_CURRENT_TRACK } from '@/store/actions.type';
import {
  lighten,
  isLight,
  TEXT_PRIMARY_LIGHT,
  TEXT_PRIMARY_DARK
} from '@/themes';

@Component
export default class PlayButton extends Mixins(PlayerBarColorMixin) {
  @Prop() size!: number;

  @State(state => state.musicPlayer.isPlaying) isPlaying!: boolean;

  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;

  get songStatusIcon(): string {
    return this.isPlaying ? 'pause' : 'play_arrow';
  }

  get buttonStyle() {
    const accent = this.$vuetify.theme.accent as string;
    const accentLighten2 = lighten(accent, 20);
    const accentLighten1 = lighten(accent, 10);
    const size = this.size || 50;

    return {
      background: `linear-gradient(-45deg, ${accent}, #${accentLighten1})`,
      'box-shadow': `0px 0px 15px #${accentLighten2}`,
      width: `${this.size}px`,
      height: `${this.size}px`,
      'border-radius': `${this.size / 2}px`
    };
  }

  get iconStyle() {
    return isLight(this.$vuetify.theme.accent as string)
      ? TEXT_PRIMARY_LIGHT
      : TEXT_PRIMARY_DARK;
  }
}
</script>

<style lang="scss" scoped>
.play-button:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}
</style>
