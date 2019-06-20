<template>
  <v-toolbar app fixed color="primary" flat id="app-toolbar">
    <v-container class="py-0">
      <v-layout row wrap align-center>
        <v-toolbar-side-icon
          id="app-side-icon"
          @click.stop="$emit('toggle-sidebar')"
        ></v-toolbar-side-icon>
        <template v-if="standaloneMode">
          <v-btn
            dark
            title="Back"
            icon
            id="app-back-btn"
            @click="$router.back()"
          >
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-btn
            dark
            title="Forward"
            icon
            id="app-forward-btn"
            @click="$router.forward()"
          >
            <v-icon>arrow_forward</v-icon>
          </v-btn>
        </template>

        <v-spacer></v-spacer>
        <v-flex sm5 md4>
          <SearchTextField v-if="$vuetify.breakpoint.smAndUp" />
        </v-flex>

        <v-icon
          v-if="$vuetify.breakpoint.xsOnly"
          @click="showSearchTextFullWidth = true"
          >search</v-icon
        >
        <app-button v-if="!isAuthenticated" @on-click="login" class="mr-0"
          >Log in</app-button
        >
        <v-menu
          v-else
          offset-y
          transition="scale-transition"
          :nudge-bottom="10"
        >
          <v-btn icon large flat slot="activator" class="mr-0">
            <v-avatar color="accent" size="40px">
              <div :class="$style['flag']" :style="flagStyle"></div>
              <v-icon :color="iconStyle" small>account_circle</v-icon>
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

        <SearchTextField
          v-if="showSearchTextFullWidth"
          :class="$style['search-text--full-width']"
          :autofocus="true"
          @on-blur="showSearchTextFullWidth = false"
        />
      </v-layout>
    </v-container>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
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

  get standaloneMode(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches;
  }

  get flagStyle() {
    const storefront = MusicKit.getInstance().storefrontId;

    return {
      background: `url('https://lipis.github.io/flag-icon-css/flags/1x1/${storefront}.svg')`
    };
  }

  onSettingsClicked() {
    this.$emit('open-settings');
  }
}
</script>

<style lang="scss" module>
.search-text--full-width {
  position: absolute;
  left: 0;
  right: 0;
}

.flag {
  border: 1px solid white;
  border-radius: 50%;
  position: absolute;
  width: 14px;
  height: 14px;
  bottom: 0;
  right: 0;
}
</style>

<style lang="scss">
#app-toolbar .v-toolbar__content {
  justify-content: center;
  padding: 0;
}

#app-side-icon {
  margin-left: -1rem;
}

#app-back-btn {
  margin: 0;
}

#app-forward-btn {
  margin: 0;
}
</style>
