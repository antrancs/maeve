<template>
  <div class="app-header">
    <div class="brand">Maeve</div>
    <input
      type="text"
      class="search-bar"
      @change="handleSearchTextChanged"
    />
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
.app-header {
  background-color: #1e212c;
  display: flex;
  flex: 0 0 5rem;
}

.brand {
  flex-basis: $sidebar-width;
}

.search-bar {
  width: 300px;
}
</style>
