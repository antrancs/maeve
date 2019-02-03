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
    <PlayerBar v-if="currentPlaying" />
    <PlayQueue v-if="$vuetify.breakpoint.mdAndUp" />
    <AppSnackbar />
    <NewPlaylistDialog ref="newPlaylistDialog" />
    <MediaActionMenu ref="mediaActionMenu" />
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
// import PlayerBar from '@/components/MusicPlayer/ThePlayerBar.vue';
import PlayQueue from '@/components/PlayQueue.vue';
import AppFooter from '@/components/TheFooter.vue';
import AppSnackbar from '@/components/TheSnackbar.vue';
import MediaActionMenu from '@/components/MediaActionMenu.vue';
import NewPlaylistDialog from '@/components/NewPlaylistDialog.vue';
import ThemeSetting from '@/components/ThemeSetting.vue';
import { State, Action, Getter } from 'vuex-class';
import { ThemeOption, Nullable } from '@/@types/model/model';
import { LOAD_SETTINGS, LOAD_TOKEN_LASTFM } from '@/store/actions.type';

@Component({
  components: {
    AppHeader,
    PlayerBar: () => import('@/components/MusicPlayer/ThePlayerBar.vue'),
    AppSidebar,
    PlayQueue,
    AppFooter,
    AppSnackbar,
    NewPlaylistDialog,
    ThemeSetting,
    MediaActionMenu
  }
})
export default class App extends Vue {
  private showSidebar = this.$vuetify.breakpoint.lgAndUp;
  private themeSetting = false;

  @State(state => state.settings.selectedTheme) selectedTheme!: ThemeOption;
  @State(state => state.musicPlayer.currentPlaying) currentPlaying!: Nullable<
    MusicKit.MediaItem
  >;

  @Action [LOAD_SETTINGS]: () => void;
  @Action [LOAD_TOKEN_LASTFM]: () => void;

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
    // @ts-ignore
    this.$root.$mediaActionMenu = this.$refs.mediaActionMenu;
  }

  created() {
    this.loadSettings();
    this.loadTokenLastfm();
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

#app .v-dialog {
  -webkit-overflow-scrolling: touch;
}

.flex-basis-0 {
  flex-basis: 0;
}

.small-list-tile-action {
  min-width: 30px;
}

.item-card {
  height: 100%;
  border-radius: 10px;
}

.white-text {
  color: white;
}

.card-text {
  font-size: 1.5rem;
}

.skew-div {
  position: relative;
  z-index: 2;
}

.skew-div::before {
  background-color: var(--v-primary-base);
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  height: 6rem;
  overflow-x: hidden;
  transform: translateZ(0) skewY(-2deg);
  z-index: -1;
  outline: 0.1rem solid transparent;
  top: -2.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: opacity 1s, transform 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-move {
  transition: transform 1s;
}
</style>
