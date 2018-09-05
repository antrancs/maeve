<template>
    <div class="app-body">
        <app-sidebar :is-logged-in="true"></app-sidebar>
        <router-view class="main-content"></router-view>
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
  height: calc(100% - 50px);
}

.main-content {
  height: 100%;
  overflow-y: auto;
  padding-left: 16px;
  padding-bottom: 102px;
  width: 100%;
}
</style>
