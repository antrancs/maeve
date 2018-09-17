<template>
  <ul :class="['context-menu', { active: isActive }]" :style="contextMenuStyle">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import { Prop, Component } from 'vue-property-decorator';

import ContextMenuItem from './ContextMenuItem.vue';

@Component({
  components: {
    ContextMenuItem
  }
})
export default class ContextMenu extends Vue {
  private width: number = 0;
  private height: number = 0;
  private left: number = 0;
  private top: number = 0;
  private isActive: boolean = false;

  get contextMenuStyle(): object {
    return {
      left: this.left + 'px',
      top: this.top + 'px'
    };
  }
  show(pageX: number, pageY: number) {
    console.log(pageX, pageY);
    if (!this.width || !this.height) {
      this.width = this.$el.offsetWidth;
      this.height = this.$el.offsetHeight;
    }

    if (this.width + pageX >= window.innerWidth) {
      this.left = pageX - this.width;
    } else {
      this.left = pageX;
    }
    if (this.height + pageY >= window.innerHeight) {
      this.top = pageY - this.height;
    } else {
      this.top = pageY;
    }
    this.isActive = true;
  }

  close() {
    console.log('CLosing');
    this.isActive = false;
  }
}
</script>

<style lang="scss" scoped>
.context-menu {
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  display: none;
  list-style: none;
  position: absolute;
  z-index: 100000;
  background-color: black;
  border: 1px solid #ebebeb;
  border-bottom-width: 0px;

  &.active {
    display: block;
  }
}
</style>

