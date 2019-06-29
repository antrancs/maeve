<template>
  <v-container v-if="collection" class="page-content mt-2 pt-0">
    <v-layout row wrap class="mb-4" align-start>
      <v-flex xs12 style="position: relative" v-if="collectionDescription">
        <p
          ref="collectionDescriptionRef"
          :class="[
            $style['collection-description'],
            {
              'long-text-truncated': editorialNoteCollapse,
              [$style[
                'collection-description--max-height'
              ]]: editorialNoteCollapse
            },
            'mb-3'
          ]"
          v-html="collectionDescription"
        ></p>
        <button
          v-if="isCollectionDescriptionOverflow"
          :class="[
            $style['more-button'],
            { [$style['expanded']]: !editorialNoteCollapse }
          ]"
          @click="editorialNoteCollapse = !editorialNoteCollapse"
        >
          {{ editorialNoteCollapse ? 'more' : 'less' }}
        </button>
      </v-flex>
      <v-flex
        :class="[
          $style['left-col'],
          $vuetify.breakpoint.mdAndUp ? 'md3' : 'xs12'
        ]"
      >
        <CollectionDetailArtwork
          :class="[$style['cover']]"
          :artworks="artworks"
          :isAlbum="isFromAlbum"
          :backgroundGradients="backgroundGradients"
        />

        <div :class="[$style['song-info'], 'mt-2']">
          {{ songs.length }} {{ songs.length > 1 ? 'tracks' : 'track' }}
        </div>
        <div :class="$style['collection-date']">
          <template v-if="collection.type === 'albums'">
            {{ releaseDate }}
          </template>
          <template v-else-if="collection.type === 'playlists' && updatedDate">
            Updated {{ updatedDate }}
          </template>
        </div>

        <CollectionControls
          v-if="songs.length > 0"
          :collection="collection"
          :songs="songs"
        />
      </v-flex>

      <v-spacer v-if="isFromAlbum && $vuetify.breakpoint.mdAndUp"></v-spacer>

      <v-flex
        :class="[
          $style['song-list'],
          $vuetify.breakpoint.smAndDown ? 'xs12' : isFromAlbum ? 'md7' : 'md9',
          { 'elevation-4': isFromAlbum }
        ]"
        :style="isFromAlbum ? songListBackgroundStyle : {}"
      >
        <SongListLarge
          :songs="songs"
          :fromAlbum="isFromAlbum"
          :onSongClicked="handleSongClicked"
        />
      </v-flex>
    </v-layout>

    <content-section v-if="otherAlbumsFromArtists.length > 0">
      <template #section-header>
        More by {{ collectionArtistName }}
      </template>

      <template #section-content>
        <CollectionCarousel
          v-if="$vuetify.breakpoint.smAndDown"
          :collections="otherAlbumsFromArtists"
        />
        <SongCollectionList v-else :collections="otherAlbumsFromArtists" />
      </template>
    </content-section>

    <content-section v-if="relatedAlbums.length > 0">
      <template #section-header>
        Albums you might also like
      </template>

      <template #section-content>
        <CollectionCarousel
          v-if="$vuetify.breakpoint.smAndDown"
          :collections="relatedAlbums"
        />
        <SongCollectionList v-else :collections="relatedAlbums" />
      </template>
    </content-section>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import { Route } from 'vue-router';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import isToday from 'date-fns/is_today';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import SongListLarge from '@/components/Song/SongListLarge.vue';
import CollectionControls from '@/components/Collection/CollectionControls.vue';
import CollectionDetailArtwork from '@/components/Collection/CollectionDetailArtwork.vue';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';
import CollectionInfo from '@/components/Collection/CollectionInfo.vue';
import {
  Nullable,
  Collection,
  Artist,
  Album,
  CollectionType,
  Song
} from '@/@types/model/model';

import {
  FETCH_ONE_ALBUM_CATALOG,
  FETCH_MULTILE_ALBUMS_CATALOG,
  FETCH_ONE_PLAYLIST_CATALOG,
  FETCH_ONE_ALBUM_LIBRARY,
  FETCH_ONE_PLAYLIST_LIBRARY,
  FETCH_ALBUM_EXTRA_INFO_CATALOG,
  FETCH_LIBRARY_PLAYLIST_TRACKS,
  PLAY_COLLECTION
} from '@/store/actions.type';
import {
  FetchOneAlbumCatalogAction,
  FetchMultipleAlbumsCatalogAction,
  FetchOnePlaylistCatalogAction,
  FetchOneAlbumLibraryAction,
  FetchOnePlaylistLibraryAction,
  FetchLibraryPlaylistTracksAction,
  PlayCollectionAction
} from '@/store/types';
import { SET_FOOTER_VISIBILITY } from '@/store/mutations.type';
import { getGradientBackgroundColorsFromArtwork } from '@/utils/utils';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { isLight } from '@/themes';

@Component({
  components: {
    SongListLarge,
    SongCollectionList: () =>
      import('@/components/Song/SongCollectionList.vue'),
    CollectionCarousel: () =>
      import('@/components/Collection/CollectionCarousel.vue'),
    CollectionControls,
    CollectionDetailArtwork
  }
})
export default class CollectionDetail extends Mixins(DataLoadingMixin) {
  private collection: Nullable<Collection> = null;
  private relatedAlbums: MusicKit.Album[] = [];
  private otherAlbumsFromArtists: MusicKit.Album[] = [];
  private editorialNoteCollapse = true;
  private backgroundGradients: string[] = [];
  private songs: Song[] = [];
  private isCollectionDescriptionOverflow = false;

  @Prop() id!: string;

  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: MusicKit.MediaItem | null;

  @Action [FETCH_ONE_ALBUM_CATALOG]: FetchOneAlbumCatalogAction;
  @Action [FETCH_MULTILE_ALBUMS_CATALOG]: FetchMultipleAlbumsCatalogAction;
  @Action [FETCH_ONE_PLAYLIST_CATALOG]: FetchOnePlaylistCatalogAction;
  @Action [FETCH_ONE_ALBUM_LIBRARY]: FetchOneAlbumLibraryAction;
  @Action [FETCH_ONE_PLAYLIST_LIBRARY]: FetchOnePlaylistLibraryAction;
  @Action [FETCH_LIBRARY_PLAYLIST_TRACKS]: FetchLibraryPlaylistTracksAction;
  @Action [FETCH_ALBUM_EXTRA_INFO_CATALOG]: (url: string) => Promise<any>;
  @Action [PLAY_COLLECTION]: PlayCollectionAction;

  @Mutation [SET_FOOTER_VISIBILITY]: (visibility: boolean) => void;

  get isFromAlbum(): boolean {
    if (!this.collection) {
      return false;
    }
    return (
      this.collection.type === 'library-albums' ||
      this.collection.type === 'albums'
    );
  }

  get collectionDescription() {
    if (!this.collection || !this.collection.attributes) {
      return null;
    }

    switch (this.collection.type) {
      case 'albums':
        return this.collection.attributes.editorialNotes
          ? this.collection.attributes.editorialNotes.standard
          : null;

      case 'playlists':
        return this.collection.attributes.description
          ? this.collection.attributes.description.standard
          : null;
    }

    return null;
  }

  get artworks(): (MusicKit.Artwork | undefined)[] {
    if (!this.collection || !this.collection.attributes) {
      return [];
    }
    switch (this.collection.type) {
      case 'albums':
      case 'library-albums':
      case 'playlists':
        return [this.collection.attributes.artwork];

      case 'library-playlists': {
        if (!this.collection.attributes.canEdit) {
          return [this.collection.attributes.artwork];
        }
        const artworkSet: Set<string> = new Set<string>();
        const artworks: MusicKit.Artwork[] = [];

        for (const song of this.songs) {
          if (artworks.length === 4) {
            break;
          }
          if (!song.attributes || !song.attributes.artwork) {
            continue;
          }
          if (!artworkSet.has(song.attributes.artwork.url)) {
            artworks.push(song.attributes.artwork);
            artworkSet.add(song.attributes.artwork.url);
          }
        }

        return [...artworks];
      }

      default:
        return [];
    }
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

  get songListBackgroundStyle() {
    return {
      'background-image': `linear-gradient(to right bottom, ${this.backgroundGradients.join(
        ','
      )})`
    };
  }

  // for albums
  get releaseDate() {
    if (!this.collection || !this.collection.attributes) {
      return null;
    }

    if (this.collection.type === 'albums') {
      const releaseDateStr = this.collection.attributes.releaseDate;

      const releaseDate = parse(releaseDateStr);
      const formattedReleaseDate = format(
        parse(releaseDateStr),
        'MMM DD, YYYY'
      );

      if (releaseDate > new Date()) {
        return `Coming ${formattedReleaseDate}`;
      }
      return `Released ${formattedReleaseDate}`;
    }

    return null;
  }

  // for playlists
  get updatedDate() {
    if (!this.collection || !this.collection.attributes) {
      return null;
    }

    if (this.collection.type === 'playlists') {
      const lastModifiedDateStr = this.collection.attributes.lastModifiedDate;

      if (!lastModifiedDateStr) {
        return null;
      }
      const lastModifiedDate = new Date(lastModifiedDateStr);

      return isToday(lastModifiedDate)
        ? 'Today'
        : `${distanceInWordsToNow(lastModifiedDate)} ago`;
    }

    return null;
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

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.$emit('show-extended-header', {
      component: null,
      props: null
    });
    this.relatedAlbums = [];
    this.otherAlbumsFromArtists = [];
    this.songs = [];
    this.fetchCollection();
  }

  created() {
    this.setFooterVisibility(false);
  }

  mounted() {
    this.fetchCollection();
  }

  beforeDestroy() {
    this.setFooterVisibility(true);
    this.$emit('show-extended-header', {
      component: null,
      props: null
    });
  }

  fetchCollection() {
    this.collection = null;

    switch (this.collectionType) {
      case CollectionType.album:
        this.fetchOneAlbumCatalog(this.id)
          .then(collection => {
            this.collection = collection;
            this.$_showCollectionInfoInHeader();
            this.$_fetchAlbumExtraInfo(collection);
            this.$_getSongsFromCollection(collection);
            this.$_getBackgroundGradients();
            this.$_checkCollectionDescriptionOverflow();
          })
          .finally(() => this.dataLoadingDone());

        break;

      case CollectionType.playlist:
        this.fetchOnePlaylistCatalog(this.id)
          .then(collection => {
            this.collection = collection;
            this.$_showCollectionInfoInHeader();
            this.$_getSongsFromCollection(collection);
            this.$_getBackgroundGradients();
            this.$_checkCollectionDescriptionOverflow();
          })
          .finally(() => this.dataLoadingDone());
        break;

      case CollectionType.libraryAlbum:
        this.fetchOneAlbumLibrary(this.id)
          .then(collection => {
            this.collection = collection;
            this.$_getSongsFromCollection(collection);
            this.$_getBackgroundGradients();
            this.$_checkCollectionDescriptionOverflow();
          })
          .finally(() => this.dataLoadingDone());
        break;

      case CollectionType.libraryPlaylist:
        this.fetchOnePlaylistLibrary(this.id).then(collection => {
          this.collection = collection;
          this.$_getBackgroundGradients();
          this.$_checkCollectionDescriptionOverflow();
        });

        this.fetchLibraryPlaylistTracks(this.id)
          .then(tracks => {
            this.songs = tracks;
          })
          .finally(() => this.dataLoadingDone());
    }
  }

  $_getBackgroundGradients() {
    if (
      !this.collection ||
      !this.collection.attributes ||
      !this.collection.attributes.artwork
    ) {
      return {};
    }

    this.backgroundGradients = getGradientBackgroundColorsFromArtwork(
      this.collection.attributes.artwork
    );
  }

  handleSongClicked(songId: string, songIndex: number) {
    if (!this.collection) {
      return;
    }

    this.playCollection({
      collectionId: this.id,
      collectionType: this.collection.type,
      startPosition: songIndex
    });
  }

  $_getSongsFromCollection(collection: Collection) {
    if (
      collection &&
      collection.relationships &&
      collection.relationships.tracks
    ) {
      this.songs = collection.relationships.tracks.data;
    }
  }

  $_showCollectionInfoInHeader() {
    this.$emit('show-extended-header', {
      component: CollectionInfo,
      props: {
        collection: this.collection,
        collectionArtistName: this.collectionArtistName
      }
    });
  }

  async $_fetchAlbumExtraInfo(album: MusicKit.Album) {
    if (!album.attributes) {
      return;
    }
    const info = await this.fetchAlbumExtraInfoCatalog(album.attributes.url);

    if (info.relatedAlbums && info.relatedAlbums.length > 0) {
      this.fetchMultipleAlbumsCatalog(info.relatedAlbums).then(albums => {
        this.relatedAlbums = albums;
      });
    }

    if (info.otherAlbums && info.otherAlbums.length > 0) {
      this.fetchMultipleAlbumsCatalog(info.otherAlbums).then(albums => {
        this.otherAlbumsFromArtists = albums;
      });
    }
  }

  $_checkCollectionDescriptionOverflow() {
    this.$nextTick(() => {
      const collectionDescriptionRef = this.$refs.collectionDescriptionRef;

      if (collectionDescriptionRef) {
        this.isCollectionDescriptionOverflow =
          (collectionDescriptionRef as HTMLElement).offsetWidth <
          (collectionDescriptionRef as HTMLElement).scrollWidth;
      }
    });
  }
}
</script>

<style lang="scss" module>
.cover {
  border-radius: 2rem;
  width: 90%;
}

.left-col {
  position: sticky;
  top: 152px;
}

.song-list {
  background-color: var(--v-primary-base);
  border-radius: 2rem;
}

.song-info {
  font-weight: bold;
}

.collection-date {
  color: var(--v-secondaryText-base);
}

.collection-description {
  color: var(--v-secondaryText-base);
  font-size: 1.4rem;
}

.collection-description--max-height {
  max-height: 1.8rem;
}

.more-button {
  background-color: var(--v-primary-base);
  box-shadow: 0px 0px 5px 5px var(--v-primary-base);
  color: var(--v-accent-base);
  font-size: 1.4rem;
  position: absolute;
  right: 0;
  top: 0.2rem;
}

.more-button.expanded {
  bottom: 1rem;
  top: auto;
}

@media (max-width: $md-breakpoint - 1) {
  .cover {
    width: 20rem;
  }

  .left-col {
    position: initial;
    top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.6rem;
  }
}
</style>
