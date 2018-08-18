<template>
    <div class="sidebar">
        <h3>Your Music</h3>
        <sidebar-authenticated v-if="isLoggedIn"></sidebar-authenticated>
        <sidebar-unauthenticated v-else></sidebar-unauthenticated>
    </div>
</template>

<script>
import SidebarAuthenticated from './TheSidebarAuthenticated.vue';
import SidebarUnauthenticated from './TheSidebarUnauthenticated.vue';

export default {
  name: 'AppSidebar',
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  components: {
    SidebarAuthenticated,
    SidebarUnauthenticated
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 220px;
}
</style>
