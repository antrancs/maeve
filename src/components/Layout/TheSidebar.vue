<template>
  <v-navigation-drawer
    app
    fixed
    :clipped="false"
    :width="210"
    class="primary elevation-10 scrollbar-show-on-hover"
    v-model="sidebar"
  >
    <v-layout column fill-height justify-space-between class="sidebar-dark">
      <v-list>
        <v-list-tile>
          <router-link :to="{ name: 'home' }">
            <img class="logo" src="@/assets/logo-desktop.png" alt="logo" />
          </router-link>
        </v-list-tile>
        <template v-for="link in navigationLinks">
          <v-list-tile
            v-if="!link.subItems"
            :key="link.name"
            :to="{ name: link.pathName, params: link.params }"
            active-class="accent--text"
            ripple
          >
            <v-list-tile-action>
              <v-icon v-if="link.icon">{{ link.icon }}</v-icon>
              <SvgIcon v-else :iconName="link.customSvgIcon" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ link.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-group v-else :key="link.name" value="true">
            <v-list-tile slot="activator">
              <v-list-tile-title class="menu-group-title">{{
                link.name
              }}</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              v-for="subItem in link.subItems"
              :key="subItem.name"
              :to="{
                name: subItem.pathName,
                params: subItem.params
              }"
              active-class="accent--text"
              exact
              ripple
            >
              <v-list-tile-action>
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>

        <v-list-group v-if="isAuthenticated" value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title class="menu-group-title"
              >My playlists</v-list-tile-title
            >
          </v-list-tile>

          <v-list-tile @click="handleNewPlaylistClicked">
            <v-list-tile-action class="small-list-tile-action">
              <v-icon>playlist_add</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>New Playlist</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            active-class="accent--text"
            exact
            ripple
            v-for="playlist in playlists"
            :to="{
              name: 'library-playlists',
              params: {
                id: playlist.id
              }
            }"
            :key="playlist.id"
            class="playlists-section pl-2 small-tile"
          >
            <v-list-tile-action class="small-list-tile-action">
              <v-icon>queue_music</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{
                playlist.attributes.name
              }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>

        <p v-if="!isAuthenticated" class="pa-2">
          Log in with your Apple Music to listen to full songs and manage your
          playlists
        </p>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { Getter, State, Action } from 'vuex-class';

import SvgIcon from '@/components/SvgIcon.vue';
import {
  MusicPlayerState,
  FetchLibraryPlaylistsActions,
  OpenNewPlaylistDialogAction
} from '@/store/types';
import {
  FETCH_LIBRARY_PLAYLISTS,
  OPEN_NEW_PLAYLIST_DIALOG
} from '@/store/actions.type';
import { isLight, TEXT_PRIMARY_LIGHT, TEXT_PRIMARY_DARK } from '@/themes';

@Component({
  components: {
    SvgIcon
  }
})
export default class AppSidebar extends Vue {
  private unauthenticatedLinks = [
    {
      name: 'Home',
      icon: 'home',
      pathName: 'home'
    },
    {
      name: 'Charts',
      icon: 'show_chart',
      pathName: 'charts'
    }
  ];

  private lastfmLink = {
    name: 'Lastfm',
    customSvgIcon: 'lastfm-icon',
    pathName: 'lastfm'
  };

  private authenticatedLinks = [
    {
      name: 'For You',
      icon: 'favorite',
      pathName: 'forYou'
    },
    {
      name: 'History',
      icon: 'history',
      pathName: 'history'
    },
    {
      name: 'My Library',
      icon: 'library_music',
      pathName: 'myLibrary',
      subItems: [
        {
          name: 'Albums',
          icon: 'album',
          pathName: 'myLibrary',
          params: {
            resource: 'albums'
          }
        },
        {
          name: 'Playlists',
          icon: 'queue_music',
          pathName: 'myLibrary',
          params: {
            resource: 'playlists'
          }
        },
        {
          name: 'Songs',
          icon: 'music_note',
          pathName: 'myLibrary',
          params: {
            resource: 'songs'
          }
        },
        {
          name: 'Artists',
          icon: 'person',
          pathName: 'myLibraryArtists'
        }
      ]
    }
  ];

  @Prop() showSidebar!: boolean;

  @Getter isAuthenticated!: boolean;
  @Getter isAuthenticatedLastfm!: boolean;

  @State(state => state.library.playlists)
  playlists!: MusicKit.LibraryPlaylist[];
  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: MusicKit.MediaItem | null;

  @Action [FETCH_LIBRARY_PLAYLISTS]: FetchLibraryPlaylistsActions;
  @Action [OPEN_NEW_PLAYLIST_DIALOG]: OpenNewPlaylistDialogAction;

  get sidebar(): boolean {
    return this.showSidebar;
  }

  set sidebar(value) {
    this.$emit('sidebar-visibility-change', value);
  }

  get navigationLinks(): Object[] {
    const links: {
      name: string;
      icon?: string;
      pathName: string;
      customSvgIcon?: string;
    }[] = [...this.unauthenticatedLinks];

    if (this.isAuthenticated) {
      // Only show Lastfm menu when log in
      if (this.isAuthenticatedLastfm) {
        links.push(this.lastfmLink);
      }
      links.push(...this.authenticatedLinks);
    }

    return links;
  }

  @Watch('isAuthenticated')
  authenticationChanged(newVal: boolean, oldVal: boolean) {
    // fetch library playlists when user logs in
    if (newVal) {
      this.fetchLibraryPlaylists({
        offset: 0,
        limit: 50
      });
    }
  }

  created() {
    if (this.isAuthenticated) {
      this.fetchLibraryPlaylists({
        offset: 0,
        limit: 50
      });
    }
  }

  handleNewPlaylistClicked() {
    this.openNewPlaylistDialog();
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_logo.scss';
.v-list__tile--active .v-list__tile__title {
  font-weight: bold;
}

.menu-group-title {
  color: var(--v-secondaryText-base);
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
}

.playlists-section {
  & .v-list__tile__title {
    font-size: 14px;
  }

  & .v-icon {
    font-size: 20px;
  }
}

.v-list__tile--active.v-list__tile.v-list__tile--link svg {
  fill: var(--v-accent-base);
}

.v-list__tile--link.theme--light svg {
  fill: rgba(0, 0, 0, 0.54);
}

.v-list__tile--link svg {
  fill: white;
}
</style>

<style lang="scss">
.small-tile .v-list__tile {
  height: 30px;
}

.scrollbar-show-on-hover.v-navigation-drawer {
  overflow-y: hidden;
}

.scrollbar-show-on-hover.v-navigation-drawer:hover {
  overflow-y: auto;
}
</style>
