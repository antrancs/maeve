<template>
  <v-footer
    height="auto"
    class="justify-center primary lighten-1 pt-3 px-3"
    :class="paddingBottomClass"
  >
    <p class="text-xs-center ma-0 footer--content">
      Copyright © {{ new Date().getFullYear() }} —
      <a
        target="_blank"
        class="link link--external"
        href="https://github.com/antrancs"
        >An Tran</a
      >

      <br />

      Have feedback or report a bug? Submit an issue on
      <a
        target="_blank"
        class="link link--external"
        href="https://github.com/antrancs/maeve/issues"
        >Github</a
      >
      or send an email to
      <a
        target="_blank"
        class="link link--external"
        href="mailto:an.tran.cs@gmail.com"
        >an.tran.cs@gmail.com</a
      >
    </p>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class AppFooter extends Vue {
  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: MusicKit.MediaItem | null;

  get paddingBottomClass(): string {
    return this.currentPlaying
      ? 'padding-bottom--player-bar'
      : 'padding-bottom';
  }
}
</script>

<style lang="scss" scoped>
.padding-bottom {
  padding-bottom: 1.6rem;
}

.padding-bottom--player-bar {
  padding-bottom: 1.6rem + $player-bar-height;
}
</style>
