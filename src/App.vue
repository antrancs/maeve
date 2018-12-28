<template>
  <v-app id="app" dark class="primary">
    <AppSidebar :showSidebar="showSidebar" />
    <AppHeader @toggle-sidebar="showSidebar = !showSidebar" />
    <v-content>
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
import AppBody from '@/components/AppBody.vue';
import AppHeader from '@/components/TheHeader.vue';
import PlayerBar from '@/components/ThePlayerBar.vue';
import PlayQueue from '@/components/PlayQueue.vue';
import AppFooter from '@/components/TheFooter.vue';
import AppSnackbar from '@/components/TheSnackbar.vue';

@Component({
  components: {
    AppHeader,
    AppBody,
    PlayerBar,
    AppSidebar,
    PlayQueue,
    AppFooter,
    AppSnackbar
  }
})
export default class App extends Vue {
  private showSidebar = true;
}
</script>

<style lang="scss">
@import '~normalize.css/normalize';
@import '@/styles/styles.scss';

.flex-basis-0 {
  flex-basis: 0;
}
</style>
