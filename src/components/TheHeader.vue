<template>
  <v-toolbar dark app fixed clipped-left class="secondary darken-1">
    <v-toolbar-side-icon
      @click.stop="$emit('toggle-sidebar')"
    ></v-toolbar-side-icon>

    <router-link :to="{ name: 'home' }">
      <img
        class="logo logo--desktop mr-5"
        src="@/assets/logo-desktop.png"
        alt="logo"
      />
    </router-link>

    <v-text-field
      label="Search"
      prepend-inner-icon="search"
      flat
      solo-inverted
      hide-details
      v-model="searchText"
    ></v-text-field>
    <v-spacer></v-spacer>

    <v-btn v-if="!isAuthenticated" @click="login" color="#da0f47">
      Log in
    </v-btn>
    <v-btn
      v-else
      @click="logout"
      class="custom-btn"
      :color="this.$vuetify.theme.accent"
      >Log out</v-btn
    >
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import { debounce } from 'lodash';

import { LOGOUT, LOGIN } from '@/store/actions.type';

@Component
export default class AppHeader extends Vue {
  private searchText = '';
  private debouncedHandleSearchTextChanged!: () => void;

  @Getter
  isAuthenticated!: boolean;

  @Action
  [LOGOUT]: () => void;
  @Action
  [LOGIN]: () => void;

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

  handleSearchTextChanged() {
    if (this.searchText && this.searchText.trim().length > 0) {
      this.$router.push({ name: 'search', query: { q: this.searchText } });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_logo.scss';

.header {
  align-items: center;
  background-color: $header-color;
  flex: none;
  height: $header-height;
}

.header__left {
  flex: 0 0 $sidebar-width-collapsed;
  padding-left: $m-size;
}

.header__right {
  justify-content: space-between;
  flex: 1;
}

@media (min-width: $bp-tablet-landscape) {
  .header__left {
    flex: 0 0 $sidebar-width;
  }
}
</style>
