<template>
  <v-app id="app" dark class="primary">
    <AppSidebar
      :showSidebar="showSidebar"
      @sidebar-visibility-change="updateSidebarVisibility"
    />
    <AppHeader @toggle-sidebar="showSidebar = !showSidebar" />
    <v-content class="app-body">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>

    <AppFooter />
    <PlayerBar />
    <PlayQueue />
    <AppSnackbar />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppSidebar from '@/components/TheSidebar.vue';
import AppHeader from '@/components/TheHeader.vue';
import PlayerBar from '@/components/ThePlayerBar.vue';
import PlayQueue from '@/components/PlayQueue.vue';
import AppFooter from '@/components/TheFooter.vue';
import AppSnackbar from '@/components/TheSnackbar.vue';

@Component({
  components: {
    AppHeader,
    PlayerBar,
    AppSidebar,
    PlayQueue,
    AppFooter,
    AppSnackbar
  }
})
export default class App extends Vue {
  private showSidebar = true;

  updateSidebarVisibility(value: boolean) {
    this.showSidebar = value;
  }
}
</script>

<style lang="scss">
@import '~normalize.css/normalize';
@import '@/styles/styles.scss';

.app-body .v-content__wrap {
  -webkit-overflow-scrolling: touch;
}

.flex-basis-0 {
  flex-basis: 0;
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
