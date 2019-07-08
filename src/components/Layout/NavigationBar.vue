<template>
  <div>
    <div
      :class="[$style['browse-button-wrapper'], 'text-xs-center', 'mb-2 py-2']"
    >
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="[
          $style['browse-button'],
          'elevation-3',
          { [$style['browse-button--active']]: tab.value === value }
        ]"
        @click="$emit('input', tab.value)"
      >
        {{ tab.name }}
      </button>
    </div>

    <transition name="fade" mode="out-in">
      <slot></slot>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

import { NavigationTabItem } from '../../@types/model/model';

@Component
export default class NavigationBar extends Vue {
  @Prop() tabs!: { [id: string]: NavigationTabItem };
  @Prop() value!: string;
}
</script>

<style lang="scss" module>
.browse-button-wrapper {
  overflow-x: scroll;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.browse-button {
  text-transform: uppercase;
  font-weight: 500;
  padding: 1rem;
  margin-right: 1.6rem;
  border-radius: 0.4rem;
  color: var(--v-primaryText-base);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.browse-button--active {
  color: var(--v-accent-darken4);
  background-color: var(--v-accent-lighten5);
}
</style>
