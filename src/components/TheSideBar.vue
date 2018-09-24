<template>
  <div class="sidebar">
    <sidebar-authenticated v-if="isAuthenticated"></sidebar-authenticated>
    <sidebar-unauthenticated v-else></sidebar-unauthenticated>

    <img
      v-if="currentTrackArtwork && currentTrackArtwork.length > 0"
      class="side-bar__song-artwork"
      :src="currentTrackArtwork"
      alt=""
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, State } from 'vuex-class';

import SidebarAuthenticated from '@/components/TheSidebarAuthenticated.vue';
import SidebarUnauthenticated from '@/components/TheSidebarUnauthenticated.vue';
import { MusicPlayerState } from '@/store/types';

@Component({
  components: {
    SidebarAuthenticated,
    SidebarUnauthenticated
  }
})
export default class AppSidebar extends Vue {
  @Getter currentTrackArtwork!: string;
  @Getter isAuthenticated!: boolean;
}
</script>

<style lang="scss">
@import '@/styles/components/_sidebar.scss';
</style>
