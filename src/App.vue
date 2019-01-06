<template>
  <v-app id="app" class="primary" :dark="darkMode">
    <AppSidebar
      :showSidebar="showSidebar"
      @sidebar-visibility-change="updateSidebarVisibility"
    />
    <AppHeader
      @toggle-sidebar="showSidebar = !showSidebar"
      @open-settings="themeSetting = !themeSetting"
    />
    <v-content class="app-body">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>

    <AppFooter />
    <PlayerBar />
    <PlayQueue />
    <AppSnackbar />
    <NewPlaylistDialog ref="newPlaylistDialog" />

    <v-navigation-drawer
      class="primary lighten-1"
      temporary
      right
      v-model="themeSetting"
      hide-overlay
      fixed
    >
      <ThemeSetting />
    </v-navigation-drawer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import AppSidebar from '@/components/TheSidebar.vue';
import AppHeader from '@/components/TheHeader.vue';
import PlayerBar from '@/components/ThePlayerBar.vue';
import PlayQueue from '@/components/PlayQueue.vue';
import AppFooter from '@/components/TheFooter.vue';
import AppSnackbar from '@/components/TheSnackbar.vue';
import NewPlaylistDialog from '@/components/NewPlaylistDialog.vue';
import ThemeSetting from '@/components/ThemeSetting.vue';
import { State, Action, Getter } from 'vuex-class';
import { ThemeOption } from '@/@types/model/model';
import { LOAD_SETTINGS } from '@/store/actions.type';

@Component({
  components: {
    AppHeader,
    PlayerBar,
    AppSidebar,
    PlayQueue,
    AppFooter,
    AppSnackbar,
    NewPlaylistDialog,
    ThemeSetting
  }
})
export default class App extends Vue {
  private showSidebar = true;
  private themeSetting = false;

  @State(state => state.settings.selectedTheme) selectedTheme!: ThemeOption;

  @Action [LOAD_SETTINGS]: () => void;

  @Watch('selectedTheme', { deep: true })
  onThemeChanged(newVal: ThemeOption) {
    if (newVal) {
      const { primary, secondary, accent, primaryText, secondaryText } = newVal;
      this.$vuetify.theme.primary = primary;
      this.$vuetify.theme.secondary = secondary;
      this.$vuetify.theme.accent = accent;
      this.$vuetify.theme.primaryText = primaryText;
      this.$vuetify.theme.secondaryText = secondaryText;
    }
  }

  @Getter darkMode!: boolean;

  mounted() {
    // @ts-ignore
    this.$root.$newPlaylistDialog = this.$refs.newPlaylistDialog;
  }

  created() {
    this.loadSettings();
  }

  updateSidebarVisibility(value: boolean) {
    this.showSidebar = value;
  }
}
</script>

<style lang="scss">
@import '~normalize.css/normalize';
@import '@/styles/styles.scss';

.app-body .v-content__wrap {
  -webkit-overflow-scrolling: touch;
}

.flex-basis-0 {
  flex-basis: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.small-list-tile-action {
  min-width: 30px;
}

.item-card {
  height: 100%;
  border-radius: 10px;
}
</style>
