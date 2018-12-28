<template>
  <div>
    <div>
      <transition name="fade" mode="out-in">
        <router-view class="main-content"></router-view>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppFooter from '@/components/TheFooter.vue';
@Component({
  components: {
    AppFooter
  }
})
export default class AppBody extends Vue {}
</script>

<style lang="scss" scoped>
.app-body {
  display: flex;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.main-content-wrapper {
  flex: 1;
  overflow-y: auto;
}

.main-content {
  flex: 1;
}

.context-menu-showing .main-content-wrapper {
  overflow-y: hidden;
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
