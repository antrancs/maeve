<template>
  <div class="sidebar">
    <sidebar-authenticated v-if="isAuthenticated"></sidebar-authenticated>
    <sidebar-unauthenticated v-else></sidebar-unauthenticated>

    <img
      class="side-bar__song-artwork"
      :src="currentTrackArtwork" alt="">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

import SidebarAuthenticated from './TheSidebarAuthenticated.vue';
import SidebarUnauthenticated from './TheSidebarUnauthenticated.vue';

@Component({
  components: {
    SidebarAuthenticated,
    SidebarUnauthenticated
  }
})
export default class AppSidebar extends Vue {
  @Prop({ default: false })
  isLoggedIn!: boolean;

  @Getter currentTrackArtwork!: string;
  @Getter isAuthenticated!: boolean;
}
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: $sidebar-color;
  flex: 0 0 18rem;
}

.side-bar__song-artwork {
  height: 180px;
  width: 180px;
  position: fixed;
  bottom: 72px;
}
</style>
