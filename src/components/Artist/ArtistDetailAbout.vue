<template functional>
  <div class="px-2">
    <section v-if="props.birthday" class="mb-2">
      <small class="label sub-info-text">{{
        props.birthday.length > 4 ? 'Born' : 'Formed'
      }}</small>
      <div>{{ props.birthday }}</div>
    </section>

    <section v-if="props.origin" class="mb-2">
      <small class="label sub-info-text">Hometown</small>
      <div>{{ props.origin }}</div>
    </section>

    <section v-if="props.bio">
      <small class="label sub-info-text">About</small>
      <p class="bio" v-if="props.bio" v-html="props.bio"></p>
    </section>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    bio: String,
    birthday: String,
    origin: String
  }
};
</script>

<style lang="scss" scoped>
.label {
  text-transform: uppercase;
  font-weight: bold;
}

.bio {
  white-space: pre-wrap;
}
</style>
