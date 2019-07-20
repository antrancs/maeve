<template>
  <v-footer
    v-if="showFooter"
    height="auto"
    class="justify-center primary darken-1 py-2 px-3"
  >
    <p class="text-xs-center ma-0 footer--content">
      Copyright © {{ new Date().getFullYear() }} —
      <a
        target="_blank"
        class="link link--external"
        href="https://twitter.com/an_t_tran"
        >An Tran</a
      >

      <br />
      Feedback & bug report @
      <a
        target="_blank"
        rel="noopener"
        class="link link--external"
        href="https://github.com/antrancs/maeve/issues"
        >Github</a
      >
      or
      <a
        target="_blank"
        class="link link--external"
        rel="noopener"
        href="mailto:support@maevemusic.app"
        >email</a
      >. Like this site?
      <a
        class="link link--external"
        target="_blank"
        rel="noopener"
        href="https://buymeacoff.ee/maeve"
        >Buy me a coffee ☕️
      </a>
    </p>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Getter } from 'vuex-class';

@Component
export default class AppFooter extends Vue {
  @State(state => state.layout.showFooter) showFooter!: boolean;
}
</script>

<style lang="scss" scoped>
.padding-bottom {
  padding-bottom: 1.6rem;
}
</style>
