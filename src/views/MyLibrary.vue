<template>
  <v-container>
    <content-section>
      <template #section-header>
        Library {{ resource }}
      </template>

      <template #section-header-right>
        <v-menu v-show="!loading" offset-y>
          <v-btn round dark color="accent" slot="activator" class="mx-0">
            Sort by: {{ sortOption.name }}
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
          <v-list class="primary lighten-1">
            <v-list-tile
              v-for="(option, index) in sortOptions"
              :key="index"
              @click="() => updateSortOption(option)"
            >
              <v-list-tile-title>{{ option.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>

      <template #section-content v-show="resourceItems.length > 0">
        <SectionList :sections="sections">
          <template #default="{listItem}">
            <SongListLargeItem
              v-if="resource === 'songs'"
              :song="listItem"
              @song-item-clicked="handleSongClicked"
              @actions-icon-click="handleActionIconClick"
              @go-to-album-page="goToAlbumPage"
              @go-to-artist-page="goToArtistPage"
            />
            <LibraryCollectionListItem v-else :collection="listItem" />
          </template>
        </SectionList>
      </template>
    </content-section>

    <p v-if="resourceItems.length === 0 && !loading">
      You don't have any {{ resource }} in your library
    </p>

    <p v-if="loading && loadingItems.length > 0">
      Fetching {{ loadingItems.length }} {{ resource }}
    </p>
    <v-progress-circular
      v-else-if="loading && loadingItems.length === 0"
      indeterminate
      color="accent"
    ></v-progress-circular>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import LibraryCollectionListItem from '@/components/Library/Collection/LibraryCollectionListItem.vue';
import SongListLargeItem from '@/components/Song/SongListLargeItem.vue';
import SectionList from '@/components/SectionList/SectionList.vue';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';
import GoToArtistPageMixin from '@/mixins/GoToArtistPageMixin';
import GoToAlbumPageMixin from '@/mixins/GoToAlbumPageMixin';
import { LibrarySortOption, Song } from '../@types/model/model';
import {
  FETCH_LIBRARY_ALBUMS,
  FETCH_LIBRARY_PLAYLISTS,
  FETCH_LIBRARY_SONGS,
  PLAY_SONGS,
  SHOW_MEDIA_ACTION_MENU
} from '../store/actions.type';
import {
  FetchLibraryAlbumsActions,
  FetchLibraryPlaylistsActions,
  FetchResult,
  FetchLibrarySongsActions,
  PlaySongsAction,
  ShowMediaActionMenuAction
} from '../store/types';
import { Route } from 'vue-router';

@Component({
  components: {
    SectionList,
    LibraryCollectionListItem,
    SongListLargeItem
  }
})
export default class MyLibrary extends Mixins(
  DataLoadingMixin,
  GoToArtistPageMixin,
  GoToAlbumPageMixin
) {
  @Prop() resource!: string;

  private sections: {
    [key: string]: (
      | MusicKit.LibraryAlbum
      | MusicKit.LibraryPlaylist
      | MusicKit.LibrarySong)[];
  } = {};
  private albumsSortOptions: LibrarySortOption[] = [
    {
      name: 'Name',
      value: 'name'
    },
    {
      name: 'Artist',
      value: 'artistName'
    }
  ];
  private playlistsSortOptions: LibrarySortOption[] = [
    {
      name: 'Name',
      value: 'name'
    },
    {
      name: 'Type',
      value: 'canEdit'
    }
  ];
  private songsSortOptions: LibrarySortOption[] = [
    {
      name: 'Name',
      value: 'name'
    },
    {
      name: 'Artist',
      value: 'artistName'
    }
  ];

  private sortOption: LibrarySortOption = {
    name: 'Name',
    value: 'name'
  };
  private resourceItems:
    | MusicKit.LibraryAlbum[]
    | MusicKit.LibraryPlaylist[]
    | MusicKit.LibrarySong[] = [];
  private loading = false;
  private loadingItems: any[] = [];

  @Action [FETCH_LIBRARY_ALBUMS]: FetchLibraryAlbumsActions;
  @Action [FETCH_LIBRARY_PLAYLISTS]: FetchLibraryPlaylistsActions;
  @Action [FETCH_LIBRARY_SONGS]: FetchLibrarySongsActions;
  @Action
  [PLAY_SONGS]: PlaySongsAction;
  @Action [SHOW_MEDIA_ACTION_MENU]: ShowMediaActionMenuAction;

  get sortOptions() {
    switch (this.resource) {
      case 'albums':
        return this.albumsSortOptions;
      case 'playlists':
        return this.playlistsSortOptions;
      case 'songs':
        return this.songsSortOptions;
      default:
        return [];
    }
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.resourceItems = [];
    this.sections = {};
    this.loadingItems = [];
    this.sortOption = {
      name: 'Name',
      value: 'name'
    };
    this.$_fetchAll();
  }

  created() {
    this.$_fetchAll();
  }

  $_groupSections() {
    const sectionMap: {
      [key: string]: (
        | MusicKit.LibraryAlbum
        | MusicKit.LibraryPlaylist
        | MusicKit.LibrarySong)[];
    } = {};

    for (const resourceItem of this.resourceItems) {
      if (
        !resourceItem.attributes ||
        resourceItem.attributes[this.sortOption.value] === undefined
      ) {
        continue;
      }

      let firstLetter = '#';
      let sectionName: string;
      // special case
      if (
        this.resource === 'playlists' &&
        this.sortOption.value === 'canEdit'
      ) {
        sectionName = (resourceItem.attributes as MusicKit.LibraryPlaylistAttributes)
          .canEdit
          ? 'Music Playlists'
          : 'Apple Music Playlists';
      } else {
        const sortFieldName = resourceItem.attributes[this.sortOption.value];
        firstLetter = sortFieldName.charAt(0).toUpperCase();
        const firstLetterCharCode = firstLetter.charCodeAt(0);
        // numbers, special characters...
        if (firstLetterCharCode <= 64) {
          firstLetter = '#';
        }

        sectionName = firstLetter;
      }

      if (!sectionMap[sectionName]) {
        sectionMap[sectionName] = [];
      }

      sectionMap[sectionName].push(resourceItem);
    }

    this.sections = sectionMap;
  }

  async $_fetchAll() {
    this.loading = true;
    const limit = 100;
    let offset = 0;
    let hasNext = false;
    let hasNoData = false;

    try {
      for (;;) {
        let fetchResult:
          | FetchResult<MusicKit.LibraryAlbum>
          | FetchResult<MusicKit.LibraryPlaylist>
          | FetchResult<MusicKit.LibrarySong>;
        if (this.resource === 'albums') {
          fetchResult = await this.fetchLibraryAlbums({
            offset,
            limit
          });
        } else if (this.resource === 'playlists') {
          fetchResult = await this.fetchLibraryPlaylists({
            offset,
            limit
          });
        } else if (this.resource === 'songs') {
          fetchResult = await this.fetchLibrarySongs({
            offset,
            limit
          });
        } else {
          break;
        }
        this.loadingItems.push(...fetchResult.data);
        if (fetchResult.hasNoData || !fetchResult.hasNext) {
          break;
        }
        offset += limit;
        if (this.loadingItems.length >= 5000) {
          break;
        }
      }
      this.resourceItems = this.loadingItems;
      this.$_groupSections();
      this.loading = false;
    } finally {
      this.dataLoadingDone();
    }
  }

  updateSortOption(value: LibrarySortOption) {
    this.sortOption = value;
    this.$_groupSections();
  }

  handleSongClicked(songId: string, songIndex: number) {
    this.playSongs({
      songs: this.resourceItems as MusicKit.LibrarySong[],
      shuffle: false,
      startId: songId,
      sourceInfo: {
        name: 'Library songs',
        path: {
          name: 'myLibrary',
          params: {
            resource: 'songs'
          }
        }
      }
    });
  }

  handleActionIconClick(song: Song, posX: number, posY: number) {
    this.showMediaActionMenu({
      posX,
      posY,
      isQueue: false,
      item: song
    });
  }
}
</script>
