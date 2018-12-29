<template>
  <v-navigation-drawer
    app
    fixed
    clipped
    :width="200"
    class="primary lighten-1 elevation-10"
    v-model="sidebar"
  >
    <v-layout column fill-height justify-space-between>
      <v-list>
        <v-list-tile
          v-for="link in navigationLinks"
          :key="link.pathName"
          :to="{ name: link.pathName }"
          active-class="accent--text"
          exact
          ripple
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <p v-if="!isAuthenticated" class="pa-2">
          Log in with your Apple Music to listen to full songs and manage your
          playlists
        </p>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Getter, State } from 'vuex-class';

import { MusicPlayerState } from '@/store/types';

@Component({})
export default class AppSidebar extends Vue {
  private unauthenticatedLinks = [
    {
      name: 'Home',
      icon: 'home',
      pathName: 'home'
    }
  ];
  private authenticatedLinks = [
    ...this.unauthenticatedLinks,
    {
      name: 'For You',
      icon: 'favorite',
      pathName: 'forYou'
    },
    {
      name: 'My Library',
      icon: 'library_music',
      pathName: 'myLibrary'
    }
  ];

  @Prop() showSidebar!: boolean;

  get sidebar(): boolean {
    return this.showSidebar;
  }

  set sidebar(value) {
    this.$emit('sidebar-visibility-change', value);
  }

  get navigationLinks(): Object[] {
    return this.isAuthenticated
      ? this.authenticatedLinks
      : this.unauthenticatedLinks;
  }

  @Getter isAuthenticated!: boolean;
}
</script>

<style lang="scss">
/* @import '@/styles/components/_sidebar.scss'; */
</style>
