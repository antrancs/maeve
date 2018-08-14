<template>
    <div class="main-content">
        <side-bar></side-bar>

        <div>
            Main Content here
        </div>
    </div>
</template>

<script>
import SideBar from './../components/TheSideBar.vue';

export default {
  name: 'MainContent',
  components: {
    SideBar
  }
};
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
}
</style>
