<template>
    <div>
        <p>Log in with your Apple Music to listen to full songs and manage your playlists</p>
        <button @click="authorize">Log in</button>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component
export default class SidebarUnauthenticated extends Vue {
  @Action login!: () => void;

  authorize() {
    this.login();
    // console.log('Authorize');
    // this.$music.authorize();
  }
}
</script>

<style lang="scss" scoped>
</style>
