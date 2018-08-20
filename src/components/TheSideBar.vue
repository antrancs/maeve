<template>
    <div class="sidebar">
        <sidebar-authenticated v-if="isLoggedIn"></sidebar-authenticated>
        <sidebar-unauthenticated v-else></sidebar-unauthenticated>

        <img
          class="side-bar--song-artwork"
          :src="currentPlayingArtwork" alt="">
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
  },

  computed: {
    ...mapGetters(['currentPlayingArtwork'])
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
