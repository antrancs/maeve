<template>
  <v-container fill-height class="pt-3 pb-2">
    <v-layout column>
      <v-flex shrink class="mb-2">
        <v-layout row justify-center>
          <div
            class="button-tab"
            v-for="(tab, key) in tabs"
            :key="tab.id"
            :class="{ active: currentTab === key }"
          >
            <button color="accent" outline @click="currentTab = key">
              {{ tab.name }}
            </button>
            <div class="line"></div>
          </div>
        </v-layout>
      </v-flex>
      <v-flex>
        <transition name="fade" mode="out-in">
          <component v-bind:is="currentTabComponent" class="tab"></component>
        </transition>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Mutation } from 'vuex-class';

import ChartsByCountry from '@/components/Charts/ChartsByCountry.vue';
import ChartsByGenre from '@/components/Charts/ChartsByGenre.vue';
import { SET_FOOTER_VISIBILITY } from '@/store/mutations.type';

@Component({
  components: {
    ChartsByCountry,
    ChartsByGenre
  }
})
export default class Charts extends Vue {
  private tabs: { [id: string]: { name: string; component: string } } = {
    genre: {
      name: 'By genre',
      component: 'ChartsByGenre'
    },
    country: {
      name: 'By country',
      component: 'ChartsByCountry'
    }
  };
  private currentTab = 'genre';

  @Mutation [SET_FOOTER_VISIBILITY]: (visibility: boolean) => void;

  get currentTabComponent(): string {
    return this.tabs[this.currentTab].component;
  }

  created() {
    this.setFooterVisibility(false);
  }

  beforeDestroy() {
    this.setFooterVisibility(true);
  }
}
</script>

<style lang="scss" scoped>
.world-playlist-wrapper {
  position: absolute;
  right: 0;
  width: 40%;
  background-color: var(--v-primary-lighten1);
  transition: top 1s, height 1s;
  overflow-y: scroll;
}

.button-tab button {
  color: var(--v-secondaryText-base);
  font-weight: bold;
  padding: 0.8rem;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.button-tab .line {
  background-color: var(--v-accent-base);
  height: 2px;
  // transition: width 0.25s ease;
  width: 0px;
}

.button-tab.active .line {
  width: 100%;
}

.button-tab.active button {
  color: var(--v-primaryText-base);
}
</style>
