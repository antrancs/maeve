<template>
  <v-btn
    icon
    title="Previous"
    @click.stop="handlePlayPrevious"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <v-icon
      :medium="!size"
      :style="primaryStyle"
      :size="size"
      :color="buttonColor"
      >skip_previous</v-icon
    >
  </v-btn>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import { PLAY_PREVIOUS } from '@/store/actions.type';

@Component
export default class PlayPreviousButton extends Mixins(PlayerBarColorMixin) {
  @Prop() size!: number;

  @Action
  [PLAY_PREVIOUS]: () => void;

  @Getter canGoBack!: boolean;

  get buttonColor() {
    return this.canGoBack ? 'primaryText' : 'secondaryText';
  }

  handlePlayPrevious() {
    if (this.canGoBack) {
      this.playPrevious();
      this.$emit('on-previous');
    }
  }
}
</script>
