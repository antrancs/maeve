<template>
    <div class="app-body">
        <app-sidebar :is-logged-in="true"></app-sidebar>
        <router-view class="main-content"></router-view>
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

.main-content {
  height: 100%;
  overflow-y: auto;
  padding-left: 16px;
  padding-bottom: 102px;
  width: 100%;
}
</style>
