<template>
  <v-btn
    icon
    title="Next"
    @click.stop="handlePlayNext"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <v-icon
      :medium="!size"
      :style="primaryStyle"
      :size="size"
      :color="buttonColor"
      >skip_next</v-icon
    >
  </v-btn>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import { PLAY_NEXT } from '@/store/actions.type';
import { PlayNextPayload } from '@/store/types';

@Component
export default class PlayNextButton extends Mixins(PlayerBarColorMixin) {
  @Prop() size!: number;

  @Action
  [PLAY_NEXT]: (payload: PlayNextPayload) => void;

  @Getter canGoNext!: boolean;

  get buttonColor() {
    return this.canGoNext ? 'primaryText' : 'secondaryText';
  }

  handlePlayNext() {
    if (this.canGoNext) {
      this.playNext({
        forceSkip: true
      });
      this.$emit('on-next');
    }
  }
}
</script>
