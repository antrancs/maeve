<template>
  <li class="context-menu-item" @click="onClick">
    <slot></slot>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

@Component
export default class ContextMenuItem extends Vue {
  @Prop() onClick!: () => void;
}
</script>

<style lang="scss" scoped>
.context-menu-item {
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  display: flex;
  padding: 8px 15px;
}
</style>

