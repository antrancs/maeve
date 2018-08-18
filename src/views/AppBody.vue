<template>
    <div class="app-body">
        <app-sidebar :is-logged-in="true"></app-sidebar>
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
}

.app-body--main-content {
  width: 100%;
}
</style>
