<template>
  <v-toolbar app fixed clipped-left :class="['primary lighten-1']">
    <v-toolbar-side-icon
      @click.stop="$emit('toggle-sidebar')"
    ></v-toolbar-side-icon>

    <router-link :to="{ name: 'home' }">
      <img
        v-if="$vuetify.breakpoint.mdAndUp"
        :class="$style['logo']"
        src="@/assets/logo-desktop.png"
        alt="logo"
      />
      <img
        style="margin-top: 4px"
        v-else
        :class="$style['logo']"
        src="@/assets/logo-mobile.png"
        alt="logo"
      />
    </router-link>

    <div
      style="position: absolute; right: 0"
      :style="searchTextAndLoginBtnWidthStyle"
    >
      <v-container class="py-0">
        <v-layout row align-center>
          <SearchTextField v-if="$vuetify.breakpoint.smAndUp" />
          <v-spacer></v-spacer>

          <v-icon
            v-if="$vuetify.breakpoint.xsOnly"
            @click="showSearchTextFullWidth = true"
            >search</v-icon
          >

          <app-button v-if="!isAuthenticated" @on-click="login" class="mr-1"
            >Log in</app-button
          >
          <v-menu
            v-else
            offset-y
            transition="scale-transition"
            :nudge-bottom="10"
          >
            <v-btn icon large flat slot="activator" class="mr-1">
              <v-avatar color="accent" size="40px">
                <v-icon :color="iconStyle">account_circle</v-icon>
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
                  <v-list-tile-title>{{
                    accountAction.title
                  }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-layout>
      </v-container>
    </div>

    <SearchTextField
      v-if="showSearchTextFullWidth"
      :class="$style['search-text--full-width']"
      :autofocus="true"
      @on-blur="showSearchTextFullWidth = false"
    />
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

import SearchTextField from '@/components/Header/SearchTextField.vue';
import { LOGOUT, LOGIN } from '@/store/actions.type';
import { isLight, TEXT_PRIMARY_LIGHT, TEXT_PRIMARY_DARK } from '@/themes';

@Component({
  components: {
    SearchTextField
  }
})
export default class AppHeader extends Vue {
  private showSearchTextFullWidth = false;

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

  get iconStyle() {
    return isLight(this.$vuetify.theme.accent as string)
      ? TEXT_PRIMARY_LIGHT
      : TEXT_PRIMARY_DARK;
  }

  get searchTextAndLoginBtnWidthStyle() {
    if (this.$vuetify.breakpoint.mdAndUp) {
      return {
        left: '210px'
      };
    }

    return {
      left: '100px'
    };
  }

  onSettingsClicked() {
    this.$emit('open-settings');
  }
}
</script>

<style lang="scss" module>
@import '@/styles/components/_logo.scss';

.search-text--full-width {
  position: absolute;
  left: 0;
  right: 2rem;
}
</style>
