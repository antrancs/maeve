<template>
    <div class="sidebar">
        <sidebar-authenticated v-if="isLoggedIn"></sidebar-authenticated>
        <sidebar-unauthenticated v-else></sidebar-unauthenticated>

       <!--  <img
          class="side-bar--song-artwork "
          src="https://is4-ssl.mzstatic.com/image/thumb/Music128/v4/e3/22/79/e3227975-b276-9df2-71ff-22b564bf84a9/075679873682.jpg/500x500bb.jpeg" alt=""> -->
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
  flex: 0 0 180px;
}

.side-bar--song-artwork {
  height: 180px;
  width: 180px;
  position: fixed;
  bottom: 72px;
}
</style>
