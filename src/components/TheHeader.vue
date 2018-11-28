<template>
  <div class="header flex-row">
    <div class="header__left">
      <router-link to="/">
        <img class="logo logo--desktop" src="@/assets/logo-desktop.png" alt />
        <img class="logo logo--mobile" src="@/assets/logo-mobile.png" alt />
      </router-link>
    </div>
    <div class="header__right flex-row content-spacing">
      <div class="search-bar flex-row">
        <input type="text" placeholder="Search" v-model="searchText" />
      </div>
      <div class="authButton">
        <button v-if="!isAuthenticated" @click="login" class="btn">
          Log in
        </button>
        <button v-else class="btn" @click="logout">Log out</button>
      </div>
    </div>
  </div>
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
@import '@/styles/components/_search-bar.scss';
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
