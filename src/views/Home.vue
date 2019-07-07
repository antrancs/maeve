<template>
  <v-container class="pt-1">
    <NavigationBar :tabs="tabs" v-model="currentTab">
      <keep-alive>
        <component
          @ready="$emit('ready')"
          v-bind:is="currentTabComponent"
        ></component>
      </keep-alive>
    </NavigationBar>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch, Mixins, Prop } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

import HomeExplore from '@/components/Home/HomeExplore.vue';
import NavigationBar from '@/components/Layout/NavigationBar.vue';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';
import { NavigationTabItem } from '../@types/model/model';
import { Route } from 'vue-router';

@Component({
  components: {
    NavigationBar,
    HomeExplore,
    HomeActivities: () => import('@/components/Home/HomeActivities.vue')
  }
})
export default class Home extends Mixins(DataLoadingMixin) {
  @Prop() tab!: string;

  private currentTab = 'explore';
  private tabs: {
    [id: string]: NavigationTabItem;
  } = {
    explore: {
      name: 'Explore',
      component: 'HomeExplore',
      value: 'explore'
    },
    activities: {
      name: 'Activities & Genres',
      component: 'HomeActivities',
      value: 'activities'
    }
  };

  get currentTabComponent(): string {
    return this.tabs[this.currentTab].component;
  }

  @Watch('currentTab')
  onCurrentTabChanged(newValue: string) {
    this.$router.push({ name: 'home', params: { tab: newValue } });
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    if (to.path === '/home') {
      this.$router.replace({ name: 'home', params: { tab: 'explore' } });
      this.currentTab = 'explore';
    }
  }

  created() {
    if (!this.tab) {
      this.$router.replace({ name: 'home', params: { tab: 'explore' } });
      return;
    }

    if (!this.tabs[this.tab]) {
      this.$router.push({ name: 'NotFound' });
      return;
    }
    this.currentTab = this.tab;
  }
}
</script>

<style lang="scss" scoped>
.featured-playlist__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
</style>
