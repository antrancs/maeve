<template>
  <div :class="$style['wrapper']">
    <NewReleaseHome
      v-for="release in releases"
      :key="release.id"
      :release="release"
      class="mr-3"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

import NewReleaseHome from './NewReleaseHome.vue';

@Component({
  components: {
    NewReleaseHome
  }
})
export default class NewReleaseHomeList extends Vue {
  @Prop({ default: [] }) releases!: any[];
}
</script>

<style lang="scss" module>
.wrapper {
  widows: 100%;
  overflow-x: scroll;
  display: flex;
}

/* .wrapper::-webkit-scrollbar {
  display: none;
} */

@supports (scrollbar-width: thin) {
  .wrapper {
    scrollbar-width: thin;
  }
}
</style>
