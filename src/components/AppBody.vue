<template>
  <div class="app-body">
    <app-sidebar></app-sidebar>
    <div class="main-content-wrapper">
      <transition name="fade" mode="out-in">
        <router-view class="main-content"></router-view>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppSidebar from '@/components/TheSidebar.vue';

@Component({
  components: {
    AppSidebar
  }
})
export default class AppBody extends Vue {}
</script>

<style lang="scss" scoped>
.app-body {
  display: flex;
  flex: 1;
  overflow-y: auto;
}

.main-content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}

.context-menu-showing .main-content-wrapper {
  overflow-y: hidden;
}

.main-content::after {
  content: '';
  display: block;
  padding-bottom: 10rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
