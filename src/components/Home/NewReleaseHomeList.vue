<template>
  <div :class="$style['wrapper']">
    <NewReleaseHome
      v-for="release in releases"
      :key="release.id"
      class="mr-2"
      :release="release"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import NewReleaseHome from './NewReleaseHome.vue';
import { Prop } from 'vue-property-decorator';

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
