<template>
    <div class="header">
        <h1>Maeve</h1>
        <input type="text" class="search-bar" @change="handleSearchTextChanged">
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
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
.header {
  display: flex;
  height: 50px;
}

.search-bar {
  width: 300px;
}
</style>
