<template>
  <v-navigation-drawer
    app
    fixed
    clipped
    :width="210"
    class="primary lighten-1 elevation-10"
    v-model="sidebar"
    :style="sidebarStyleHeight"
  >
    <v-layout column fill-height justify-space-between class="sidebar-dark">
      <v-list>
        <template v-for="link in navigationLinks">
          <v-list-tile
            v-if="!link.subItems"
            :key="link.pathName"
            :to="{ name: link.pathName }"
            active-class="accent--text"
            exact
            ripple
          >
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ link.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-group v-else :key="link.pathName" value="true">
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

import { MusicPlayerState, FetchLibraryPlaylistsActions } from '@/store/types';
import { FETCH_LIBRARY_PLAYLISTS } from '@/store/actions.type';
import { isLight, TEXT_PRIMARY_LIGHT, TEXT_PRIMARY_DARK } from '@/themes';

@Component
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
  private authenticatedLinks = [
    ...this.unauthenticatedLinks,
    {
      name: 'For You',
      icon: 'favorite',
      pathName: 'forYou'
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
          pathName: 'myLibrary',
          params: {
            resource: 'artists'
          }
        }
      ]
    }
  ];

  @Prop() showSidebar!: boolean;

  @Getter isAuthenticated!: boolean;

  @State(state => state.library.playlists)
  playlists!: MusicKit.LibraryPlaylist[];
  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: MusicKit.MediaItem | null;

  @Action [FETCH_LIBRARY_PLAYLISTS]: FetchLibraryPlaylistsActions;

  get sidebar(): boolean {
    return this.showSidebar;
  }

  set sidebar(value) {
    this.$emit('sidebar-visibility-change', value);
  }

  get navigationLinks(): Object[] {
    return this.isAuthenticated
      ? this.authenticatedLinks
      : this.unauthenticatedLinks;
  }

  get sidebarStyleHeight() {
    if (this.currentPlaying) {
      return {
        'max-height': this.$vuetify.breakpoint.lgAndUp
          ? 'calc(100% - 64px - 96px)'
          : 'calc(100% - 96px)' // minus the player bar height
      };
    }
    return {};
  }

  @Watch('isAuthenticated')
  authenticationChanged(newVal: boolean, oldVal: boolean) {
    // fetch library playlists when user logs in
    if (newVal) {
      this.fetchLibraryPlaylists({
        offset: 0,
        limit: 20
      });
    }
  }

  created() {
    if (this.isAuthenticated) {
      this.fetchLibraryPlaylists({
        offset: 0,
        limit: 20
      });
    }
  }

  handleNewPlaylistClicked() {
    // @ts-ignore
    this.$root.$newPlaylistDialog.open();
  }
}
</script>

<style lang="scss" scoped>
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
</style>

<style lang="scss">
.small-tile .v-list__tile {
  height: 30px;
}
</style>
