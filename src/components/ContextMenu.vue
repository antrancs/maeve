<template>
  <ul
    v-if="isActive"
    :class="['context-menu', { active: isActive }]"
    :style="contextMenuStyle"
  >
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

import ContextMenuPlugin from '@/plugins/contextMenu.plugin';

@Component
export default class ContextMenu extends Vue {
  // Data
  private width: number = 150;
  private height: number = 0;
  private left: number = 0;
  private right: number = 0;
  private top: number = 0;
  private isActive: boolean = false;

  // Props
  @Prop()
  name!: string;

  // Computed
  get contextMenuStyle(): object {
    return {
      left: this.left + 'px',
      top: this.top + 'px',
      width: this.width + 'px'
    };
  }

  // Life cycle methods
  beforeMount() {
    ContextMenuPlugin.event.$on('toggle', this.$_handleToggle);
    window.addEventListener('click', this.$_handleMouseClick);
  }

  beforeDestroy() {
    ContextMenuPlugin.event.$off('toggle', this.$_handleToggle);
    window.removeEventListener('click', this.$_handleMouseClick);
  }

  // Helper methods
  /**
   * Mouse click event listener on the window object when the context menu is open
   */
  private $_handleMouseClick(): void {
    if (this.isActive) {
      this.$_close();
    }
  }

  /**
   * Handler when the context menu is called to open/close from the ContextMenuPlugin
   * @param name Name of the context menu to toggle
   * @param clickEvent The click event where the toggle event is triggered. This is required to calculate
   * the position of the context menu
   * @param params (optional) Additional params to pass in the context menu
   */
  private $_handleToggle(
    name: string,
    clickEvent: MouseEvent,
    params?: any
  ): void {
    if (this.name === name && !this.isActive) {
      this.$_open(clickEvent, params);
    } else {
      // Just close this context menu when the name does not match OR this context menu is currently open
      this.$_close(params);
    }
  }

  /**
   * Open the context menu
   * @param clickEvent The click event where the toggle event is triggered. This is required to calculate
   * the position of the context menu
   * @param params Additional params which will be passed to components as part of the 'before-open' event
   */
  private $_open(clickEvent: MouseEvent, params: any): void {
    this.$emit('before-open', {
      params
    });

    if (clickEvent.pageX - this.width >= 0) {
      this.left = clickEvent.pageX - this.width;
    } else {
      this.left = clickEvent.pageX;
    }

    if (this.height + clickEvent.pageY >= window.innerHeight) {
      this.top = clickEvent.pageY - this.height;
    } else {
      this.top = clickEvent.pageY;
    }

    document.body.classList.add('context-menu-showing');
    this.isActive = true;
  }

  /**
   * Close the context menu
   * @param params (optional) The params that will be passed to components as part of 'before-close' event
   */
  private $_close(params?: any): void {
    this.$emit('before-close', {
      params
    });

    document.body.classList.remove('context-menu-showing');
    this.isActive = false;
  }
}
</script>

<style lang="scss" scoped>
.context-menu {
  background-color: black;
  border: 0.1rem solid #ebebeb;
  border-bottom-width: 0px;
  display: none;
  left: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  z-index: 100000;

  &.active {
    display: block;
  }
}
</style>

