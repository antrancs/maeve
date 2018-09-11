<template>
    <div>
        <p>Log in with your Apple Music to listen to full songs and manage your playlists</p>
        <button @click="authorize">Log in</button>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class SidebarUnauthenticated extends Vue {
  authorize() {
    console.log('Authorize');
    // this.$music.authorize();
  }
}
</script>

<style lang="scss" scoped>
</style>
