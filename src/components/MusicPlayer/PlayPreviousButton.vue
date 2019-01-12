<template>
  <v-btn
    icon
    @click.stop="playPrevious"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <v-icon :medium="!size" :style="primaryStyle" :size="size"
      >skip_previous</v-icon
    >
  </v-btn>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import { PLAY_PREVIOUS } from '@/store/actions.type';

@Component
export default class PlayPreviousButton extends Mixins(PlayerBarColorMixin) {
  @Prop() size!: number;

  @Action
  [PLAY_PREVIOUS]: () => void;
}
</script>
