<template>
  <div class="app-header flex-row">
    <div class="brand">Maeve</div>
    <div class="search-bar flex-row">
      <input
        type="text"
        placeholder="Search"
        @change="handleSearchTextChanged"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AppHeader extends Vue {
  handleSearchTextChanged(evt: any) {
    const searchText = evt.target.value;

    if (searchText && searchText.trim().length > 0) {
      this.$router.replace({ name: 'search', query: { q: searchText } });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_search-bar.scss';
.app-header {
  align-items: center;
  background-color: #1e212c;
  flex: none;
  height: $header-height;
}

.brand {
  flex-basis: $sidebar-width;
}
</style>
