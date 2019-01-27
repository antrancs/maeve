<template>
  <v-toolbar
    app
    fixed
    clipped-left
    :class="['primary lighten-1', { 'py-2': $vuetify.breakpoint.smAndDown }]"
  >
    <v-toolbar-side-icon
      @click.stop="$emit('toggle-sidebar')"
    ></v-toolbar-side-icon>

    <router-link :to="{ name: 'home' }">
      <img
        class="logo logo--desktop"
        src="@/assets/logo-mobile.png"
        alt="logo"
      />
    </router-link>

    <v-toolbar-title
      :class="[
        'hidden-xs-only',
        {
          'mr-5': $vuetify.breakpoint.mdAndUp
        }
      ]"
      >Maeve</v-toolbar-title
    >

    <v-text-field
      label="Search"
      prepend-inner-icon="search"
      flat
      solo-inverted
      hide-details
      v-model="searchText"
      class="ml-4"
    ></v-text-field>
    <v-spacer></v-spacer>

    <app-button v-if="!isAuthenticated" @on-click="login" class="mr-1"
      >Log in</app-button
    >
    <v-menu v-else offset-y transition="scale-transition" :nudge-bottom="10">
      <v-btn icon large flat slot="activator" class="mr-1">
        <v-avatar color="accent" size="40px">
          <v-icon>account_circle</v-icon>
        </v-avatar>
      </v-btn>

      <v-list class="pa-0 primary lighten-1">
        <v-list-tile
          v-for="(accountAction, index) in accountActions"
          @click="accountAction.click"
          ripple="ripple"
          rel="noopener"
          :key="index"
        >
          <v-list-tile-action>
            <v-icon>{{ accountAction.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ accountAction.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import debounce from 'lodash/debounce';

import { LOGOUT, LOGIN } from '@/store/actions.type';
import { isLight } from '@/themes';

@Component
export default class AppHeader extends Vue {
  private searchText = '';
  private debouncedHandleSearchTextChanged!: () => void;

  @Getter
  isAuthenticated!: boolean;
  @Getter darkMode!: boolean;

  @Action
  [LOGOUT]: () => void;
  @Action
  [LOGIN]: () => void;

  private accountActions = [
    {
      title: 'Settings',
      icon: 'settings',
      click: this.onSettingsClicked
    },
    {
      title: 'Log out',
      icon: 'fullscreen_exit',
      click: this.logout
    }
  ];

  @Watch('searchText')
  onSearchTextChanged(newVal: string, oldVal: string) {
    this.debouncedHandleSearchTextChanged();
  }

  created() {
    this.debouncedHandleSearchTextChanged = debounce(
      this.handleSearchTextChanged,
      400
    );
  }

  onSettingsClicked() {
    this.$emit('open-settings');
  }

  handleSearchTextChanged() {
    if (this.searchText && this.searchText.trim().length > 0) {
      this.$router.push({ name: 'search', query: { q: this.searchText } });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_logo.scss';
</style>
