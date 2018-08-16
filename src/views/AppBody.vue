<template>
    <div class="main-content">
        <app-sidebar :is-logged-in="false"></app-sidebar>
        <router-view></router-view>
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
.main-content {
  display: flex;
}
</style>
