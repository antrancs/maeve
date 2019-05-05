<template>
  <svg
    class="triangle"
    :style="{ height: `${height}px` }"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="
      `0
    0
    ${height}
    ${height}`
    "
    role="presentation"
    preserveAspectRatio="none"
  >
    <path
      class="triangle-path"
      :d="
        `M0
      ${height}
      L
      ${height}
      0
      V
      ${height}
      Z`
      "
    ></path>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

@Component
export default class TriangleSVG extends Vue {
  get height() {
    if (this.$vuetify.breakpoint.name === 'xs') {
      return 50;
    }
    return 70;
  }
}
</script>

<style lang="scss" scoped>
.triangle {
  width: 100%;
  position: absolute;
  bottom: -0.5px;
  left: 0;
}

.triangle-path {
  fill: var(--v-primary-base);
  stroke: var(--v-primary-base);
}
</style>
