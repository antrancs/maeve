<template>
  <v-app id="app" class="primary" :dark="darkMode">
    <AppSidebar
      :showSidebar="showSidebar"
      @sidebar-visibility-change="updateSidebarVisibility"
    />
    <AppHeader
      :extendedComponent="headerExtendedComponent"
      :extendedComponentProps="headerExtendedComponentProps"
      :storefront="storefront"
      @toggle-sidebar="showSidebar = !showSidebar"
      @open-settings="themeSetting = !themeSetting"
    />
    <v-content class="app-body">
      <transition name="fade" mode="out-in">
        <router-view
          @ready="pageLoadReady"
          @show-extended-header="onShowExtendedHeader"
        ></router-view>
      </transition>

      <PlayerBar
        v-if="currentPlaying"
        @show-player-fullscreen="showPlayerFullScreen = true"
      />
    </v-content>

    <AppFooter />
    <AppSnackbar />
    <PlayerFullScreen
      v-if="showPlayerFullScreen"
      @close-dialog="showPlayerFullScreen = false"
    />
    <PlayQueue v-if="$vuetify.breakpoint.mdAndUp" />
    <NewPlaylistDialog v-if="isAuthenticated && newPlaylistDialogVisibility" />
    <MediaActionMenu v-if="mediaActionMenuVisibility" />
    <v-navigation-drawer
      v-if="isAuthenticated"
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
import { State, Action, Getter, Mutation } from 'vuex-class';
import NProgress from 'nprogress';

import AppSidebar from '@/components/Layout/TheSidebar.vue';
import AppHeader from '@/components/Header/TheHeader.vue';
import AppFooter from '@/components/Layout/TheFooter.vue';
import AppSnackbar from '@/components/TheSnackbar.vue';
import { ThemeOption, Nullable } from '@/@types/model/model';
import {
  LOAD_SETTINGS,
  LOAD_TOKEN_LASTFM,
  CHANGE_ROUTE,
  SHOW_SNACKBAR,
  CLOSE_SNACKBAR
} from '@/store/actions.type';
import {
  SET_CURRENTLY_PLAYING_SONG,
  SET_QUEUE_VISIBILITY,
  SET_USER_TOKEN
} from './store/mutations.type';
import { ShowSnackbarAction } from './store/types';

@Component({
  components: {
    AppHeader,
    PlayerBar: () => import('@/components/MusicPlayer/ThePlayerBar.vue'),
    AppSidebar,
    AppFooter,
    AppSnackbar,
    NewPlaylistDialog: () => import('@/components/NewPlaylistDialog.vue'),
    ThemeSetting: () => import('@/components/Setting/ThemeSetting.vue'),
    MediaActionMenu: () => import('@/components/MediaActionMenu.vue'),
    PlayQueue: () => import('@/components/PlayQueue/PlayQueue.vue'),
    PlayerFullScreen: () =>
      import('@/components/MusicPlayer/PlayerFullScreen.vue')
  }
})
export default class App extends Vue {
  private showSidebar = this.$vuetify.breakpoint.lgAndUp;
  private themeSetting = false;
  private refreshing = false;
  private registration: any = null;
  private showPlayerFullScreen = false;
  private headerExtendedComponent: any = null;
  private headerExtendedComponentProps: any = null;
  private storefront = 'us';

  @State(state => state.settings.selectedTheme) selectedTheme!: ThemeOption;
  @State(state => state.musicPlayer.currentPlaying) currentPlaying!: Nullable<
    MusicKit.MediaItem
  >;
  @State(state => state.newPlaylistDialog.visibility)
  newPlaylistDialogVisibility!: boolean;
  @State(state => state.mediaActionMenu.visibility)
  mediaActionMenuVisibility!: boolean;

  @Action [LOAD_SETTINGS]: () => void;
  @Action [LOAD_TOKEN_LASTFM]: () => void;
  @Action [CHANGE_ROUTE]: (routeName: string) => void;
  @Action [SHOW_SNACKBAR]: ShowSnackbarAction;
  @Action [CLOSE_SNACKBAR]: () => void;

  @Mutation [SET_CURRENTLY_PLAYING_SONG]: (
    item: MusicKit.MediaItem | null
  ) => void;
  @Mutation [SET_USER_TOKEN]: (token: string | null) => void;
  @Mutation [SET_QUEUE_VISIBILITY]: (visibility: boolean) => void;

  @Getter darkMode!: boolean;
  @Getter isAuthenticatedLastfm!: boolean;
  @Getter
  isAuthenticated!: boolean;

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

  created() {
    // a new service worker has been updated
    document.addEventListener('swUpdated', this.showRefreshSnackbar, {
      once: true
    });

    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (this.refreshing) {
          return;
        }
        this.refreshing = true;
        window.location.reload();
      });
    }

    this.loadTokenLastfm();
    this.loadSettings();
    const musicKitInstance = MusicKit.getInstance();

    musicKitInstance.addEventListener(
      MusicKit.Events.authorizationStatusDidChange,
      this.onAuthorizationStatusDidChange
    );

    musicKitInstance.addEventListener(
      MusicKit.Events.mediaItemDidChange,
      this.onMediaItemDidChange
    );

    musicKitInstance.addEventListener(
      MusicKit.Events.storefrontCountryCodeDidChange,
      this.onStorefrontChanged
    );

    NProgress.configure({
      speed: 200,
      showSpinner: false
    });
    NProgress.start();

    this.$router.beforeEach((to, from, next) => {
      NProgress.start();
      next();
    });

    this.storefront = MusicKit.getInstance().storefrontId;
  }

  beforeDestroy() {
    const musicKitInstance = MusicKit.getInstance();
    musicKitInstance.removeEventListener(
      MusicKit.Events.authorizationStatusDidChange,
      this.onAuthorizationStatusDidChange
    );

    musicKitInstance.removeEventListener(
      MusicKit.Events.mediaItemDidChange,
      this.onMediaItemDidChange
    );

    musicKitInstance.removeEventListener(
      MusicKit.Events.storefrontCountryCodeDidChange,
      this.onStorefrontChanged
    );
  }

  pageLoadReady() {
    NProgress.done();
  }

  updateSidebarVisibility(value: boolean) {
    this.showSidebar = value;
  }

  async onAuthorizationStatusDidChange({ authorizationStatus }: any) {
    const musicKitInstance = MusicKit.getInstance();

    musicKitInstance.player.stop();

    this.setCurrentlyPlayingSong(null);
    this.setQueueVisibility(false);

    this.setUserToken(musicKitInstance.musicUserToken);

    if (!authorizationStatus) {
      this.changeRoute('home');
    }
  }

  onMediaItemDidChange({ item }: { item: MusicKit.MediaItem }) {
    this.setCurrentlyPlayingSong(item);
  }

  onStorefrontChanged(event: any) {
    const musicKitInstance = MusicKit.getInstance();
    this.storefront = event.storefrontCountryCode || 'us';

    this.setUserToken(musicKitInstance.musicUserToken);
    this.changeRoute('home');
  }

  showRefreshSnackbar(e: any) {
    this.registration = e.detail;

    this.showSnackbar({
      text: 'New version available',
      timeout: 0,
      action: {
        text: 'Refresh',
        handler: this.refreshApp
      }
    });
  }

  refreshApp() {
    this.closeSnackbar();

    if (!this.registration || !this.registration.waiting) {
      return;
    }
    this.registration.waiting.postMessage({
      type: 'SKIP_WAITING'
    });
  }

  onShowExtendedHeader(payload: { component: any; props: any }) {
    this.headerExtendedComponent = payload.component;
    this.headerExtendedComponentProps = payload.props;
  }
}
</script>

<style lang="scss">
@import '~normalize.css/normalize';
@import '@/styles/styles.scss';
@import '~nprogress/nprogress.css';

.app-body .v-content__wrap {
  -webkit-overflow-scrolling: touch;
}

#app .v-dialog {
  -webkit-overflow-scrolling: touch;
}

.small-list-tile-action {
  min-width: 30px;
}

.white-text {
  color: white;
}

.section-offset {
  margin-left: -0.8rem;
  margin-right: -0.8rem;
}

.page-title {
  font-size: 3.6rem;
  margin: 0;
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

#nprogress .bar {
  background: var(--v-accent-base);
}

.page-content {
  min-height: calc(100vh - 88px);
}

.page-content > :last-child {
  margin-bottom: 0 !important;
}

#app-toolbar .v-toolbar__extension {
  padding: 0;
  justify-content: center;
}
</style>
