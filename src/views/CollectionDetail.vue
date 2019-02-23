<template>
  <div class="collection-detail" v-if="collection">
    <div
      class="collection-detail-header"
      :style="{ height: `${headerHeight}vh` }"
    >
      <div class="banner-overlay">
        <v-container fill-height>
          <v-layout
            :class="{
              'align-end row wrap': $vuetify.breakpoint.smAndUp,
              'justify-end column': $vuetify.breakpoint.xsOnly
            }"
          >
            <v-flex
              xs12
              :style="{ 'flex-basis': $vuetify.breakpoint.xsOnly ? 0 : '100%' }"
            >
              <CollectionHeader
                :collection="collection"
                :songs="songs"
                :artworkSize="artworkSize"
                :numberOfSongs="numberOfSongs"
              />
            </v-flex>

            <div class="hidden-sm-and-up mt-2">
              <template v-if="collection">
                <CollectionControls :collection="collection" :songs="songs" />
              </template>
            </div>
          </v-layout>
        </v-container>
      </div>

      <picture class="collection-detail-header__banner">
        <source
          media="(min-width: 1200px)"
          :srcset="getCollectionArtwork(1000, 1000)"
        />

        <source
          media="(min-width: 900px)"
          :srcset="getCollectionArtwork(800, 800)"
        />

        <source
          media="(min-width: 768px)"
          :srcset="getCollectionArtwork(540, 540)"
        />

        <img class="image" :src="getCollectionArtwork(400, 400)" />
      </picture>
    </div>

    <v-container>
      <SongListLarge
        :playlistId="playlistId"
        :songs="songs"
        :fromAlbum="isFromAlbum"
      />

      <template v-if="relatedAlbums.length > 0">
        <div class="mt-3">
          <h2 class="px-2">Albums You May Also Like</h2>
          <SongCollectionList :collections="relatedAlbums" />
        </div>
      </template>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import { Action, Getter, State, Mutation } from 'vuex-class';

import SongListLarge from '@/components/SongListLarge.vue';
import MediaArtwork from '@/components/MediaArtwork.vue';
import CollectionHeader from '@/components/CollectionHeader.vue';
import CollectionControls from '@/components/CollectionControls.vue';
import CollectionSongsMixin from '@/mixins/CollectionSongsMixin';
import SongCollectionList from '@/components/SongCollectionList.vue';
import { getArtworkUrl } from '@/utils/utils';
import musicApiService from '@/services/musicApi.service';
import {
  ShowSnackbarAction,
  FetchOneAlbumCatalogAction,
  FetchOnePlaylistCatalogAction,
  FetchOnePlaylistLibraryAction,
  FetchOneAlbumLibraryAction,
  FetchMultipleAlbumsCatalogAction
} from '@/store/types';
import {
  Collection,
  Song,
  Nullable,
  CollectionType,
  SnackbarMode,
  Artist,
  CatalogCollection,
  LibraryCollection,
  Album
} from '@/@types/model/model';
import {
  SHOW_SNACKBAR,
  FETCH_ONE_ALBUM_CATALOG,
  FETCH_ONE_PLAYLIST_CATALOG,
  FETCH_ONE_PLAYLIST_LIBRARY,
  FETCH_ONE_ALBUM_LIBRARY,
  FETCH_ALBUM_EXTRA_INFO_CATALOG,
  FETCH_MULTILE_ALBUMS_CATALOG
} from '@/store/actions.type';
import { Route } from 'vue-router';
import { TEXT_PRIMARY_DARK, TEXT_SECONDARY_DARK } from '@/themes';

@Component({
  components: {
    SongListLarge,
    MediaArtwork,
    CollectionControls,
    CollectionHeader,
    SongCollectionList
  }
})
export default class CollectionDetail extends Mixins(CollectionSongsMixin) {
  private collection: Nullable<Collection> = null;
  private relatedAlbums: MusicKit.Album[] = [];
  // private songsWithRelationships: Nullable<MusicKit.Song[]> = null;
  @Prop() id!: string;

  @Getter
  isAuthenticated!: boolean;

  @Action [FETCH_ONE_ALBUM_CATALOG]: FetchOneAlbumCatalogAction;
  @Action [FETCH_ONE_PLAYLIST_CATALOG]: FetchOnePlaylistCatalogAction;
  @Action [FETCH_ONE_ALBUM_LIBRARY]: FetchOneAlbumLibraryAction;
  @Action [FETCH_ONE_PLAYLIST_LIBRARY]: FetchOnePlaylistLibraryAction;
  @Action [SHOW_SNACKBAR]: ShowSnackbarAction;
  @Action [FETCH_MULTILE_ALBUMS_CATALOG]: FetchMultipleAlbumsCatalogAction;
  @Action [FETCH_ALBUM_EXTRA_INFO_CATALOG]: (url: string) => Promise<any>;

  get numberOfSongs(): number {
    return this.songs.length;
  }

  get isFromAlbum(): boolean {
    if (!this.collection) {
      return false;
    }
    return (
      this.collection.type === 'library-albums' ||
      this.collection.type === 'albums'
    );
  }

  get collectionType(): CollectionType {
    // For now, there should be 4 types of collection: album, playlist, library-playlist & library-album
    // There might be more

    const path = this.$route.path;
    if (path.startsWith('/albums')) {
      return CollectionType.album;
    } else if (path.startsWith('/playlists')) {
      return CollectionType.playlist;
    } else if (path.startsWith('/me/library-playlists')) {
      return CollectionType.libraryPlaylist;
    } else {
      return CollectionType.libraryAlbum;
    }
  }

  get playlistId(): Nullable<string> {
    if (this.collectionType !== CollectionType.libraryPlaylist) {
      return null;
    }
    return this.id;
  }

  get releaseYear(): string {
    if (!this.collection || !this.collection.attributes) {
      return '';
    }

    let year = '';
    switch (this.collectionType) {
      case CollectionType.album:
        year = (this.collection
          .attributes as MusicKit.AlbumAttributes).releaseDate
          .toString()
          .substring(0, 4); // get year only
        break;

      case CollectionType.playlist:
        year = (this.collection
          .attributes as MusicKit.PlaylistAttributes).lastModifiedDate
          .toString()
          .substring(0, 4); // get year only
    }

    return year;
  }

  get artworkSize(): number {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 100;
      case 'sm':
        return 150;
      default:
        return 200;
    }
  }

  get headerHeight(): number {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 40;
      case 'sm':
        return 50;
      default:
        return 60;
    }
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.relatedAlbums = [];
    this.fetchCollection();
  }

  created() {
    this.fetchCollection();
  }

  async fetchCollection() {
    this.collection = null;
    this.getSongsDetail(this.collection);
    switch (this.collectionType) {
      case CollectionType.album:
        this.collection = await this.fetchOneAlbumCatalog(this.id);
        break;
      case CollectionType.playlist:
        this.collection = await this.fetchOnePlaylistCatalog(this.id);
        break;
      case CollectionType.libraryAlbum:
        this.collection = await this.fetchOneAlbumLibrary(this.id);
        break;
      case CollectionType.libraryPlaylist:
        this.collection = await this.fetchOnePlaylistLibrary(this.id);
    }

    this.getSongsDetail(this.collection);

    // fetch extra info after gettings songs details so it doesnt have to wait
    if (
      this.collection &&
      this.collection.type === 'albums' &&
      this.collection.attributes
    ) {
      const info = await this.fetchAlbumExtraInfoCatalog(
        this.collection.attributes.url
      );

      if (info.relatedAlbums && info.relatedAlbums.length > 0) {
        const albums = await this.fetchMultipleAlbumsCatalog(
          info.relatedAlbums
        );
        this.relatedAlbums = albums;
      }
    }
  }

  getCollectionArtwork(width: number, height: number) {
    if (
      !this.collection ||
      !this.collection.attributes ||
      !this.collection.attributes.artwork
    ) {
      return '';
    }

    return getArtworkUrl(this.collection.attributes.artwork.url, width, height);
  }
}
</script>

<style lang="scss" scoped>
.collection-detail {
  width: 100%;
}

.collection-detail-header {
  position: relative;
}

.banner-overlay {
  background-color: rgba(
    $color: (
      #000000
    ),
    $alpha: 0.6
  );
  height: 100%;
  position: relative;
  z-index: 1;
}

.collection-detail-header__banner {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image {
  width: 100%;
  object-fit: cover;
}
</style>
