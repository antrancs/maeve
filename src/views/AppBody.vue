<template>
    <div class="app-body">
        <app-sidebar class="app-body--side-bar" :is-logged-in="true"></app-sidebar>
        <router-view class="app-body--main-content"></router-view>
    </div>
</template>

<script>
import AppSidebar from './../components/TheSidebar.vue';

export default {
  name: 'AppBody',

  components: {
    AppSidebar
  }
};
</script>

<style lang="scss" scoped>
.app-body {
  display: flex;
  height: calc(100% - 50px);
}

.app-body--main-content {
  height: 100%;
  overflow-y: auto;
  width: 100%;
}
</style>
