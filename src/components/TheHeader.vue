<template>
    <div class="header">
        <h1>Maeve</h1>
        <input type="text" class="header--searchbar" @change="handleSearchTextChanged">
    </div>
</template>

<script>
export default {
  name: 'AppHeader',
  methods: {
    handleSearchTextChanged(evt) {
      const searchText = evt.target.value;

      if (searchText && searchText.trim().length > 0) {
        this.$router.replace({ path: 'search', query: { q: searchText } });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  height: 50px;
}

.header--searchbar {
  width: 300px;
}
</style>
