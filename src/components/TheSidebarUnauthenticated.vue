<template>
    <div>
      <p>Log in with your Apple Music to listen to full songs and manage your playlists</p>
      <button @click="authorize" class="button">Log in</button>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { LOGIN } from '@/store/actions.type';

@Component
export default class SidebarUnauthenticated extends Vue {
  @Action [LOGIN]: () => void;

  authorize() {
    this.login();
  }
}
</script>

<style lang="scss" scoped>
</style>
