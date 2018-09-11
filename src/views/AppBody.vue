<template>
    <div class="app-body">
        <app-sidebar :is-logged-in="true"></app-sidebar>
        <div class="main-content-wrapper">
          <router-view class="main-content"></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppSidebar from './../components/TheSidebar.vue';

@Component({
  components: { AppSidebar }
})
export default class AppBody extends Vue {}
</script>

<style lang="scss" scoped>
.app-body {
  display: flex;
  flex: 1;
  // height: calc(100% - 50px);
  overflow-y: auto;
}

.main-content-wrapper {
  display: flex;
  flex: 1;
  overflow-y: auto;
}

.main-content::after {
  content: '';
  display: block;
  padding-bottom: 100px;
}
</style>
