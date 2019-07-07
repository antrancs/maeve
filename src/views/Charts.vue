<template>
  <v-container class="pt-1 pb-2">
    <NavigationBar :tabs="tabs" v-model="currentTab">
      <div class="mt-2" :class="{ 'charts-country': currentTab === 'country' }">
        <keep-alive>
          <component
            @ready="componentLoadReady"
            v-bind:is="currentTabComponent"
          ></component>
        </keep-alive>
      </div>
    </NavigationBar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Action, Mutation } from 'vuex-class';

import NavigationBar from '@/components/Layout/NavigationBar.vue';
import ChartsByCountry from '@/components/Charts/ChartsByCountry.vue';
import ChartsByGenre from '@/components/Charts/ChartsByGenre.vue';
import { SET_FOOTER_VISIBILITY } from '@/store/mutations.type';
import { NavigationTabItem } from '../@types/model/model';
import { Route } from 'vue-router';

@Component({
  components: {
    NavigationBar,
    ChartsByCountry,
    ChartsByGenre
  }
})
export default class Charts extends Vue {
  @Prop() tab!: string;

  private tabs: { [id: string]: NavigationTabItem } = {
    genre: {
      name: 'By genre',
      component: 'ChartsByGenre',
      value: 'genre'
    },
    country: {
      name: 'By country',
      component: 'ChartsByCountry',
      value: 'country'
    }
  };
  private currentTab = 'genre';

  @Mutation [SET_FOOTER_VISIBILITY]: (visibility: boolean) => void;

  get currentTabComponent(): string {
    return this.tabs[this.currentTab].component;
  }

  @Watch('currentTab')
  onCurrentTabChanged(newValue: string) {
    this.$router.push({ name: 'charts', params: { tab: newValue } });
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    if (to.path === '/charts') {
      this.$router.replace({ name: 'charts', params: { tab: 'genre' } });
      this.currentTab = 'genre';
    }
  }

  created() {
    if (!this.tab) {
      this.$router.replace({ name: 'charts', params: { tab: 'genre' } });
      return;
    }
    if (!this.tabs[this.tab]) {
      this.$router.push({ name: 'NotFound' });
      return;
    }
    this.currentTab = this.tab;
    this.setFooterVisibility(false);
  }

  beforeDestroy() {
    this.setFooterVisibility(true);
  }

  componentLoadReady() {
    this.$emit('ready');
  }
}
</script>

<style lang="scss" scoped>
.charts-country {
  height: calc(100vh - 220px);
}
</style>
