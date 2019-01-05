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
              <v-layout row wrap>
                <v-flex shrink="true">
                  <MediaArtwork
                    :artwork="collection.attributes.artwork"
                    :style="artworkStyle"
                    :width="artworkSize"
                    :height="artworkSize"
                    :has-shadow="true"
                  />
                </v-flex>
                <v-flex class="pl-3">
                  <v-layout column justify-end fill-height>
                    <h2 :style="headerOverlayTextStyle">
                      {{ collectionName }}
                      <v-icon
                        dark
                        v-if="
                          collection.attributes.contentRating === 'explicit'
                        "
                        >explicit</v-icon
                      >
                    </h2>

                    <div
                      :style="headerOverlayTextStyle"
                      :class="['collection-subtitle', 'collection-artist-name']"
                    >
                      <router-link
                        v-if="artistId"
                        :to="{ name: 'artists', params: { id: artistId } }"
                      >
                        {{ collectionArtistName }}
                      </router-link>
                      <template v-else>
                        {{ collectionArtistName }}
                      </template>
                    </div>

                    <div
                      class="collection-subtitle mb-2"
                      :style="headerOverlaySecondaryTextStyle"
                    >
                      <span
                        v-if="
                          collectionType !== 'library-playlists' &&
                            collectionType !== 'library-albums'
                        "
                        >{{ releaseYear }} •</span
                      >
                      {{
                        songsWithRelationships
                          ? songsWithRelationships.length
                          : songs.length
                      }}
                      tracks
                    </div>

                    <div class="hidden-xs-only">
                      <template v-if="collection">
                        <CollectionControls
                          :collection="collection"
                          @add-to-library="handleAddToLibrary"
                          @add-to-new-playlist="handleAddSongToNewPlaylist"
                          @add-to-existing-playlist="
                            handleAddCollectionToPlaylist
                          "
                          @play-next="handlePlayCollectionNext"
                          @add-to-queue="handleAddCollectionToQueue"
                        />
                      </template>
                    </div>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>

            <div class="hidden-sm-and-up mt-2">
              <template v-if="collection">
                <CollectionControls :collection="collection" />
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
      <SongList
        :tracks="songsWithRelationships || songs"
        :collection="collection"
        :playlistId="playlistId"
      />
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Action, Getter, State, Mutation } from 'vuex-class';

import SongList from '@/components/SongList.vue';
import MediaArtwork from '@/components/MediaArtwork.vue';
import CollectionControls from '@/components/CollectionControls.vue';
import { getArtworkUrl } from '@/utils/utils';
import musicApiService from '@/services/musicApi.service';
import {
  AddToLibraryAction,
  ShowSnackbarAction,
  AddSongsToPlaylistAction,
  PrependSongsAction,
  AppendSongsAction,
  FetchOneAlbumCatalogAction,
  FetchOnePlaylistCatalogAction,
  FetchOnePlaylistLibraryaAction,
  FetchOneAlbumLibraryAction
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
  PLAY_COLLECTION_WITH_SONG,
  ADD_TO_LIBRARY,
  SHOW_SNACKBAR,
  ADD_SONGS_TO_PLAYLIST,
  PREPEND_SONGS,
  APPEND_SONGS,
  FETCH_ONE_ALBUM_CATALOG,
  FETCH_ONE_PLAYLIST_CATALOG,
  FETCH_ONE_PLAYLIST_LIBRARY,
  FETCH_ONE_ALBUM_LIBRARY
} from '@/store/actions.type';
import { Route } from 'vue-router';
import { TEXT_PRIMARY_DARK, TEXT_SECONDARY_DARK } from '@/themes';

@Component({
  components: { SongList, MediaArtwork, CollectionControls }
})
export default class CollectionDetail extends Vue {
  private collection: Nullable<Collection> = null;
  private songsWithRelationships: Nullable<MusicKit.Song[]> = null;
  @Prop() id!: string;

  @Getter
  isAuthenticated!: boolean;

  @Action [FETCH_ONE_ALBUM_CATALOG]: FetchOneAlbumCatalogAction;
  @Action [FETCH_ONE_PLAYLIST_CATALOG]: FetchOnePlaylistCatalogAction;
  @Action [FETCH_ONE_ALBUM_LIBRARY]: FetchOneAlbumLibraryAction;
  @Action [FETCH_ONE_PLAYLIST_LIBRARY]: FetchOnePlaylistLibraryaAction;
  @Action [ADD_TO_LIBRARY]: AddToLibraryAction;
  @Action [SHOW_SNACKBAR]: ShowSnackbarAction;
  @Action [ADD_SONGS_TO_PLAYLIST]: AddSongsToPlaylistAction;
  @Action [PREPEND_SONGS]: PrependSongsAction;
  @Action [APPEND_SONGS]: AppendSongsAction;
  @Action fetchCatalogSongsDetails!: (
    ids?: string[]
  ) => Promise<MusicKit.Song[]>;

  get songs(): Song[] {
    return this.songsWithRelationships
      ? []
      : this.$_getSongsFromCollection(this.collection);
  }

  get artists(): Artist[] {
    if (
      this.collection &&
      this.collection.type === 'albums' &&
      this.collection.relationships &&
      this.collection.relationships.artists
    ) {
      return this.collection.relationships.artists.data;
    }

    return [];
  }

  get collectionName(): string {
    if (!this.collection || !this.collection.attributes) {
      return '';
    }
    return this.collection.attributes.name;
  }

  get collectionArtistName(): string {
    if (!this.collection || !this.collection.attributes) {
      return '';
    }

    // artistName is only available for album
    return (
      (this.collection.attributes as MusicKit.AlbumAttributes).artistName ||
      (this.collection.attributes as MusicKit.PlaylistAttributes).curatorName ||
      ''
    );
  }

  get headerOverlayTextStyle() {
    return {
      color: TEXT_PRIMARY_DARK
    };
  }

  get headerOverlaySecondaryTextStyle() {
    return {
      color: TEXT_SECONDARY_DARK
    };
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

  get artworkStyle() {
    return {
      width: `${this.artworkSize}px`,
      height: `${this.artworkSize}px`
    };
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

  get artistId(): Nullable<string> {
    if (this.artists.length === 0) {
      return null;
    }
    return this.artists[0].id;
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.fetchCollection();
  }

  created() {
    this.fetchCollection();
  }

  async fetchCollection() {
    this.collection = null;
    this.songsWithRelationships = null;
    switch (this.collectionType) {
      case CollectionType.album:
        this.collection = await this.fetchOneAlbumCatalog(this.id);
        break;
      case CollectionType.playlist: {
        const collection = await this.fetchOnePlaylistCatalog(this.id);
        const songs = this.$_getSongsFromCollection(collection);
        const songIds = songs.map(song => song.id);
        this.songsWithRelationships = await this.fetchCatalogSongsDetails(
          songIds
        );
        this.collection = collection;
        break;
      }
      case CollectionType.libraryAlbum:
        this.collection = await this.fetchOneAlbumLibrary(this.id);
        break;
      case CollectionType.libraryPlaylist:
        this.collection = await this.fetchOnePlaylistLibrary(this.id);
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

  async handleAddToLibrary() {
    if (!this.collection) {
      return;
    }

    try {
      await this.addToLibrary({
        itemIds: [this.collection.id],
        type: this.collection.type
      });

      this.showSnackbar({
        text: 'Item has been added to library'
      });
    } catch (err) {
      this.showSnackbar({
        text: 'Cannot add item to library',
        type: SnackbarMode.error
      });
    }
  }

  async handleAddCollectionToPlaylist(playlistId: string) {
    const songs = this.songs.map(({ id, type }) => ({
      id,
      type
    }));

    try {
      this.addSongsToPlaylist({
        songItems: songs,
        playlistId
      });

      this.showSnackbar({
        text: 'Items have been added to playlist'
      });
    } catch (err) {
      this.showSnackbar({
        text: 'Cannot add items to playlist',
        type: SnackbarMode.error
      });
    }
  }

  async handleAddSongToNewPlaylist() {
    // @ts-ignore
    this.$root.$newPlaylistDialog.open(this.songs);
  }

  handlePlayCollectionNext() {
    const mediaItems = this.songs.map(
      ({ id, attributes }) =>
        new MusicKit.MediaItem({
          id,
          attributes,
          type: 'song',
          container: {
            id
          }
        })
    );

    try {
      this.prependSongs({
        items: mediaItems
      });
      this.showSnackbar({
        text: 'Collection is playing next'
      });
    } catch {
      this.showSnackbar({
        text: 'Something went wrong',
        type: SnackbarMode.error
      });
    }
  }

  handleAddCollectionToQueue() {
    const mediaItems = this.songs.map(
      ({ id, attributes }) =>
        new MusicKit.MediaItem({
          id,
          attributes,
          type: 'song',
          container: {
            id
          }
        })
    );

    try {
      // appendSongs is synchronous
      this.appendSongs({ items: mediaItems });
      this.showSnackbar({
        text: 'Collection is added to queue'
      });
    } catch {
      this.showSnackbar({
        text: 'Something went wrong',
        type: SnackbarMode.error
      });
    }
  }

  $_getSongsFromCollection(collection: Nullable<Collection>): Song[] {
    if (
      !collection ||
      !collection.relationships ||
      !collection.relationships.tracks
    ) {
      return [];
    }

    return collection.relationships.tracks.data;
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

.collection-subtitle {
  font-size: 1.8rem;
}

.collection-artist-name {
  font-weight: bold;
}

.collection-artist-name a {
  color: white;
}

.collection-artist-name a:hover {
  text-decoration: underline;
}

.image {
  width: 100%;
  object-fit: cover;
}
</style>
