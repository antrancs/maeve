<template>
  <v-btn
    icon
    @click.stop="playNext"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <v-icon :medium="!size" :style="primaryStyle" :size="size"
      >skip_next</v-icon
    >
  </v-btn>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import { PLAY_NEXT } from '@/store/actions.type';

@Component
export default class PlayNextButton extends Mixins(PlayerBarColorMixin) {
  @Prop() size!: number;

  @Action
  [PLAY_NEXT]: () => void;
}
</script>
