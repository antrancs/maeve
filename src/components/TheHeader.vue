<template>
  <div class="header flex-row">
    <div class="brand">Maeve</div>
    <div class="header__right flex-row content-spacing">
      <div class="search-bar flex-row">
        <input
          type="text"
          placeholder="Search"
          @change="handleSearchTextChanged"
        />
      </div>
      <div class="authButton">
        <button
          v-if="!isAuthenticated"
          @click="login"
          class="btn"
        >
          Log in
        </button>
        <button
          v-else
          class="btn"
          @click="logout"
        >
          Log out
        </button>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

import { LOGOUT, LOGIN } from '@/store/actions.type';

@Component
export default class AppHeader extends Vue {
  @Getter
  isAuthenticated!: boolean;

  @Action
  [LOGOUT]: () => void;
  @Action
  [LOGIN]: () => void;

  handleSearchTextChanged(evt: any) {
    const searchText = evt.target.value;

    if (searchText && searchText.trim().length > 0) {
      this.$router.push({ name: 'search', query: { q: searchText } });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_search-bar.scss';
.header {
  align-items: center;
  background-color: #1e212c;
  flex: none;
  height: $header-height;
}

.brand {
  flex: 0 0 $sidebar-width-collapsed;
}

.header__right {
  justify-content: space-between;
  flex: 1;
}

@media (min-width: $bp-tablet-landscape) {
  .brand {
    flex: 0 0 $sidebar-width;
  }
}
</style>
