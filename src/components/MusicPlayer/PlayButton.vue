<template>
  <v-btn
    icon
    @click.stop="toggleCurrentTrack"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <v-icon :size="size" :style="primaryStyle">{{ songStatusIcon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import { TOGGLE_CURRENT_TRACK } from '@/store/actions.type';

@Component
export default class PlayButton extends Mixins(PlayerBarColorMixin) {
  @Prop() size!: number;

  @State(state => state.musicPlayer.isPlaying) isPlaying!: boolean;

  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;

  get songStatusIcon(): string {
    return this.isPlaying ? 'pause' : 'play_arrow';
  }
}
</script>
