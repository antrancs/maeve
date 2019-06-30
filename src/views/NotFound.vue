<template>
  <div class="mx-4">
    <h1>Page Not Found</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  created() {
    this.$emit('ready');
  }
});
</script>
