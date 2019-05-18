<template>
  <component :is="svgIconComponent" />
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

@Component
export default class SvgIcon extends Vue {
  @Prop() iconName!: string;

  get svgIconComponent() {
    return () =>
      import(
        /* webpackMode: "lazy-once" */ `@/assets/svg/${this.iconName}.svg`
      );
  }
}
</script>
