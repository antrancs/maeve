<template functional>
  <div class="section-group-wrapper">
    {{ props.title }}
  </div>
</template>

<script lang="ts">
export default {
  props: {
    title: String
  }
};
</script>

<style lang="scss" scoped>
.section-group-wrapper {
  margin-bottom: 8px;
  height: 52px;
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: flex-end;
  border-bottom: 0.5px solid var(--v-secondaryText-darken3);
}
</style>
