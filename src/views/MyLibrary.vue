<template>
  <v-container>
    <v-layout
      row
      wrap
      v-scroll-directive="{
        onScroll: handleScroll,
        shouldLoad: 'shouldLoad',
        noMore: 'noMoreData'
      }"
    >
      <v-flex xs12 class="px-2">
        <v-layout row wrap fill-height align-center>
          <v-flex xs12 md6 lg8>
            <h2 class="section-title">My {{ resource }}</h2>
          </v-flex>

          <v-flex xs12 md6 lg4>
            <v-text-field
              color="accent"
              label="Filter"
              :placeholder="placeholderSearch"
              clearable
              v-model="searchText"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
      <template v-if="resource === 'playlists'">
        <v-flex xs12>
          <SongCollectionList
            v-if="playlists"
            :collections="filteredPlaylists"
          />
        </v-flex>
      </template>

      <template v-if="resource === 'albums'">
        <v-flex xs12>
          <SongCollectionList v-if="albums" :collections="filteredAlbums" />
        </v-flex>
      </template>

      <template v-if="resource === 'songs'">
        <v-flex xs12>
          <SongList v-if="songs" :tracks="filteredSongs" />
        </v-flex>
      </template>

      <template v-if="resource === 'artists'">
        <v-flex xs12>
          <ArtistList v-if="artists" :artists="filteredArtists" />
        </v-flex>
      </template>

      <div class="px-2" v-if="hasNoData">
        You don't have any {{ resource }} in your library
      </div>

      <v-flex class="text-xs-center" v-if="shouldLoad && !noMoreData">
        <v-progress-circular indeterminate color="accent"></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { debounce } from 'lodash';

import SongCollectionList from '@/components/SongCollectionList.vue';
import SongList from '@/components/SongList.vue';
import ArtistList from '@/components/ArtistList.vue';
import scrollDirective from '@/directives/scroll';
import musicApiService from '@/services/musicApi.service';
import { Action, Mutation } from 'vuex-class';
import { Nullable } from '@/@types/model/model';
import { Route } from 'vue-router';

import {
  FETCH_LIBRARY_SONGS,
  FETCH_LIBRARY_ALBUMS,
  FETCH_LIBRARY_PLAYLISTS,
  FETCH_LIBRARY_ARTISTS
} from '@/store/actions.type';
import {
  FetchLibraryAlbumsActions,
  FetchLibraryPlaylistsActions,
  FetchLibrarySongsActions,
  FetchLibraryArtistssActions
} from '@/store/types';

@Component({
  components: {
    SongCollectionList,
    SongList,
    ArtistList
  },
  directives: {
    scrollDirective
  }
})
export default class MyLibrary extends Vue {
  static SEARCH_LIMIT = 100;
  private playlists: MusicKit.LibraryPlaylist[] = [];
  private albums: MusicKit.LibraryAlbum[] = [];
  private songs: MusicKit.LibrarySong[] = [];
  private artists: MusicKit.LibraryArtist[] = [];

  private shouldLoad = true;
  private noMoreData = false;
  private hasNoData = false;
  private throttleScrollHandler!: (event: Event) => void;
  private offset = 0;
  private searchText = '';
  private debouncedHandleSearchTextChanged!: () => void;

  @Prop() resource!: string;

  @Action [FETCH_LIBRARY_ALBUMS]: FetchLibraryAlbumsActions;
  @Action [FETCH_LIBRARY_PLAYLISTS]: FetchLibraryPlaylistsActions;
  @Action [FETCH_LIBRARY_SONGS]: FetchLibrarySongsActions;
  @Action [FETCH_LIBRARY_ARTISTS]: FetchLibraryArtistssActions;
  @Action searchLibrary!: (searchTerm: string) => Promise<any[]>;

  get filteredAlbums(): MusicKit.LibraryAlbum[] {
    if (this.resource !== 'albums') {
      return [];
    }

    if (!this.searchText || this.searchText.trim().length === 0) {
      return this.albums;
    }

    const searchText = this.searchText.toLowerCase();

    return this.albums.filter(
      album =>
        album.attributes &&
        (album.attributes.name.toLowerCase().includes(searchText) ||
          album.attributes.artistName.toLowerCase().includes(searchText))
    );
  }

  get filteredSongs(): MusicKit.LibrarySong[] {
    if (this.resource !== 'songs') {
      return [];
    }

    if (!this.searchText || this.searchText.trim().length === 0) {
      return this.songs;
    }

    const searchText = this.searchText.toLowerCase();

    return this.songs.filter(
      song =>
        song.attributes &&
        (song.attributes.name.toLowerCase().includes(searchText) ||
          song.attributes.artistName.toLowerCase().includes(searchText) ||
          song.attributes.albumName.toLowerCase().includes(searchText))
    );
  }

  get filteredPlaylists(): MusicKit.LibraryPlaylist[] {
    if (this.resource !== 'playlists') {
      return [];
    }

    if (!this.searchText || this.searchText.trim().length === 0) {
      return this.playlists;
    }

    const searchText = this.searchText.toLowerCase();

    return this.playlists.filter(
      playlist =>
        playlist.attributes &&
        playlist.attributes.name.toLowerCase().includes(searchText)
    );
  }

  get filteredArtists(): MusicKit.LibraryArtist[] {
    if (this.resource !== 'artists') {
      return [];
    }

    if (!this.searchText || this.searchText.trim().length === 0) {
      return this.artists;
    }

    const searchText = this.searchText.toLowerCase();

    return this.artists.filter(
      artist =>
        artist.attributes &&
        artist.attributes.name.toLowerCase().includes(searchText)
    );
  }

  get placeholderSearch(): string {
    switch (this.resource) {
      case 'albums':
        return 'Album/artist name';
      case 'songs':
        return 'Song/artist/album name';
      case 'playlists':
        return 'Playlist name';
      case 'artists':
        return 'Artist name';
      default:
        return '';
    }
  }

  created() {
    this.$_fetchResource();
    this.debouncedHandleSearchTextChanged = debounce(
      this.$_handleSearchTextChanged,
      300
    );
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.searchText = '';
    this.playlists = [];
    this.albums = [];
    this.songs = [];
    this.artists = [];
    this.offset = 0;
    this.shouldLoad = true;
    this.noMoreData = false;
    this.hasNoData = false;
    this.$_fetchResource();
  }

  handleScroll(event: Event) {
    this.$_fetchResource();
  }

  @Watch('searchText')
  onSearchTextChanged(newVal: string, oldVal: string) {
    this.debouncedHandleSearchTextChanged();
  }

  async $_fetchResource() {
    this.shouldLoad = false;
    switch (this.resource) {
      case 'albums': {
        const { data, hasNext, hasNoData } = await this.fetchLibraryAlbums({
          offset: this.offset,
          limit: MyLibrary.SEARCH_LIMIT
        });
        this.$_processResult<MusicKit.LibraryAlbum>(this.albums, {
          data,
          hasNext,
          hasNoData
        });
        break;
      }

      case 'playlists': {
        const { data, hasNext, hasNoData } = await this.fetchLibraryPlaylists({
          offset: this.offset,
          limit: MyLibrary.SEARCH_LIMIT
        });
        this.$_processResult<MusicKit.LibraryPlaylist>(this.playlists, {
          data,
          hasNext,
          hasNoData
        });
        break;
      }

      case 'songs': {
        const { data, hasNext, hasNoData } = await this.fetchLibrarySongs({
          offset: this.offset,
          limit: MyLibrary.SEARCH_LIMIT
        });
        this.$_processResult<MusicKit.LibrarySong>(this.songs, {
          data,
          hasNext,
          hasNoData
        });
        break;
      }

      case 'artists': {
        const { data, hasNext, hasNoData } = await this.fetchLibraryArtists({
          offset: this.offset,
          limit: MyLibrary.SEARCH_LIMIT
        });
        this.$_processResult<MusicKit.LibraryArtist>(this.artists, {
          data,
          hasNext,
          hasNoData
        });
        break;
      }
    }
  }

  $_processResult<T>(
    resources: T[],
    result: {
      data: T[];
      hasNext: boolean;
      hasNoData: boolean;
    }
  ) {
    const { data, hasNext, hasNoData } = result;
    if (hasNoData) {
      this.hasNoData = true;
      return;
    }

    this.noMoreData = !hasNext;

    resources.push(...data);

    if (!this.noMoreData) {
      this.shouldLoad = true;
    }
    this.offset += MyLibrary.SEARCH_LIMIT;

    // For now, just set the maximum items to fetch to 300
    if (this.offset === 300) {
      this.shouldLoad = false;
    }
  }

  $_handleSearchTextChanged() {
    if (this.searchText && this.searchText.length > 0) {
      this.shouldLoad = false;
    } else {
      this.shouldLoad = true;
    }
    // this.searchLibrary(this.searchText).then(results => {
    //   console.log({ results });
    // });
  }
}
</script>
