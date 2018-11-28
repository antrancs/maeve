<template>
  <li class="context-menu-item" @click="onClick"><slot></slot></li>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

@Component
export default class ContextMenuItem extends Vue {
  @Prop()
  onClick!: () => void;
}
</script>

<style lang="scss" scoped>
.context-menu-item {
  align-items: center;
  cursor: pointer;
  display: flex;
  padding: 0.8rem 1.5rem;
}
</style>
