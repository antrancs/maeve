<template>
  <div>
    <template v-if="showFooter">
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
          Feedback & bug report @
          <a
            target="_blank"
            class="link link--external"
            href="https://github.com/antrancs/maeve/issues"
            >Github</a
          >
          or
          <a
            target="_blank"
            class="link link--external"
            href="mailto:an.tran.cs@gmail.com"
            >email</a
          >. Like this site?
          <a
            class="link link--external"
            target="_blank"
            href="https://buymeacoff.ee/maeve"
            >Buy me a coffee ☕️
          </a>
        </p>
      </v-footer>
    </template>

    <template v-else>
      <div :class="paddingBottomClass"></div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Getter } from 'vuex-class';

@Component
export default class AppFooter extends Vue {
  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: MusicKit.MediaItem | null;

  @State(state => state.layout.showFooter) showFooter!: boolean;

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
