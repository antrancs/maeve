<template>
  <v-container fill-height class="pb-0">
    <v-layout
      :class="{
        'row wrap': $vuetify.breakpoint.lgAndUp,
        column: $vuetify.breakpoint.mdAndDown
      }"
    >
      <v-flex class="mb-4" lg3 v-if="$vuetify.breakpoint.lgAndUp">
        <div
          :class="$style['left-column']"
          :style="[leftColumnBackgroundStyle]"
          v-if="collection"
        >
          <div :class="[$style['left-column__top'], 'pr-2 py-2']">
            <div
              :class="$style['collection-name']"
              :style="collectionNameStyle"
              :title="collectionName"
            >
              {{ collectionName }}
              <v-icon
                dark
                size="22"
                v-if="collection.attributes.contentRating === 'explicit'"
                >explicit</v-icon
              >
            </div>

            <ResourceLinkList
              :resources="artists"
              :class="$style['artist-name']"
              :name="collectionArtistName"
            />
          </div>

          <div :class="$style['cover-wrapper']">
            <CollectionDetailArtwork
              :class="[$style['cover'], { 'elevation-5': isFromAlbum }]"
              :style="artworkStyle"
              :artworks="artworks"
              :isAlbum="isFromAlbum"
              :backgroundGradients="backgroundGradients"
            />
          </div>

          <div :class="[$style['left-column__bottom'], 'pt-3']">
            <div :class="$style['song-info']">
              {{ songs.length }} {{ songs.length > 1 ? 'tracks' : 'track' }}
            </div>
            <div :class="$style['collection-date']">
              <template v-if="collection.type === 'albums'">
                {{ releaseDate }}
              </template>
              <template
                v-else-if="collection.type === 'playlists' && updatedDate"
              >
                Updated {{ updatedDate }}
              </template>
            </div>
          </div>
        </div>
      </v-flex>
      <v-flex v-else :class="['mb-3', { xs12: $vuetify.breakpoint.lgAndUp }]">
        <v-layout
          row
          wrap
          v-if="collection"
          :justify-center="$vuetify.breakpoint.xsOnly"
        >
          <v-flex :class="$style['cover-sm']" :style="coverSmStyle">
            <CollectionDetailArtwork
              :class="$style['cover']"
              :artworks="artworks"
              :isAlbum="isFromAlbum"
              :backgroundGradients="backgroundGradients"
            />
          </v-flex>
          <v-flex
            xs12
            sm6
            :class="{
              'pl-3': $vuetify.breakpoint.smAndUp,
              'pt-3': $vuetify.breakpoint.xsOnly
            }"
          >
            <v-layout column :align-center="$vuetify.breakpoint.xsOnly">
              <div
                :class="$style['collection-name']"
                :style="collectionNameStyle"
                :title="collectionName"
              >
                {{ collectionName }}

                <v-icon
                  dark
                  v-if="collection.attributes.contentRating === 'explicit'"
                  >explicit</v-icon
                >
              </div>

              <ResourceLinkList
                :resources="artists"
                :class="$style['artist-name']"
                :name="collectionArtistName"
              />
            </v-layout>
          </v-flex>
        </v-layout>

        <CollectionControls
          v-if="songs.length > 0"
          class="mt-2"
          :collection="collection"
          :songs="songs"
        />
      </v-flex>

      <v-spacer v-if="isFromAlbum && $vuetify.breakpoint.lgAndUp"></v-spacer>
      <v-flex
        v-if="collection"
        :class="{
          [$style['right-column']]: $vuetify.breakpoint.lgAndUp,
          lg7: isFromAlbum,
          lg9: !isFromAlbum
        }"
      >
        <template v-if="collectionDescription">
          <p
            :class="$style['collection-description']"
            :style="editorialNoteStyles"
            v-html="collectionDescription"
          ></p>
          <p
            v-if="collectionDescription.length > 260"
            :class="$style['collection-description-toggle']"
            @click="editorialNoteCollapse = !editorialNoteCollapse"
          >
            {{ editorialNoteCollapse ? 'MORE' : 'LESS' }}
          </p>
        </template>

        <v-layout row justify-end v-if="$vuetify.breakpoint.lgAndUp">
          <CollectionControls
            v-if="songs.length > 0"
            :collection="collection"
            :songs="songs"
          />
        </v-layout>
        <SongListLarge
          class="mt-2"
          :songs="songs"
          :fromAlbum="isFromAlbum"
          :onSongClicked="handleSongClicked"
        />
      </v-flex>

      <v-flex xs12 v-if="otherAlbumsFromArtists.length > 0">
        <content-section>
          <template #section-header>
            More by {{ collectionArtistName }}
          </template>

          <template #section-content>
            <SongCollectionList :collections="otherAlbumsFromArtists" />
          </template>
        </content-section>
      </v-flex>

      <v-flex xs12 v-if="relatedAlbums.length > 0">
        <content-section>
          <template #section-header>
            Albums you might also like
          </template>

          <template #section-content>
            <SongCollectionList :collections="relatedAlbums" />
          </template>
        </content-section>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import { Route } from 'vue-router';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import isToday from 'date-fns/is_today';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import ResourceLinkList from '@/components/ResourceLinkList.vue';
import SongListLarge from '@/components/Song/SongListLarge.vue';
import CollectionControls from '@/components/Collection/CollectionControls.vue';
import CollectionDetailArtwork from '@/components/Collection/CollectionDetailArtwork.vue';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';
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
  PLAY_SONGS
} from '@/store/actions.type';
import {
  FetchOneAlbumCatalogAction,
  FetchMultipleAlbumsCatalogAction,
  FetchOnePlaylistCatalogAction,
  FetchOneAlbumLibraryAction,
  FetchOnePlaylistLibraryAction,
  FetchLibraryPlaylistTracksAction,
  PlayCollectionAction,
  PlaySongsAction
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
    CollectionControls,
    ResourceLinkList,
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
  // @Action [PLAY_COLLECTION]: PlayCollectionAction;
  @Action [PLAY_SONGS]: PlaySongsAction;

  @Mutation [SET_FOOTER_VISIBILITY]: (visibility: boolean) => void;

  get editorialNoteStyles() {
    if (this.editorialNoteCollapse) {
      return {
        height: '6.5rem',
        overflow: 'hidden'
      };
    }

    return {};
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

  get leftColumnBackgroundStyle() {
    return {
      background: `linear-gradient(45deg, ${this.backgroundGradients.join(
        ','
      )})`
    };
  }

  get artists(): Nullable<Artist[]> {
    if (
      this.collection &&
      this.collection.type === 'albums' &&
      this.collection.relationships &&
      this.collection.relationships.artists
    ) {
      return this.collection.relationships.artists.data;
    }

    return null;
  }

  get collectionName() {
    if (!this.collection || !this.collection.attributes) {
      return '';
    }

    return this.collection.attributes.name;
  }

  get collectionNameStyle() {
    if (this.collectionName.length < 30) {
      return {
        'font-size': '2.2rem'
      };
    }
    return {
      'font-size': '1.8rem'
    };
  }

  get artworkStyle() {
    // Only add box-shadow for playlist artwork
    if (this.isFromAlbum) {
      return {};
    }
    if (
      !this.collection ||
      !this.collection.attributes ||
      !this.collection.attributes.artwork
    ) {
      return {};
    }
    const shadowColor =
      this.collection.attributes.artwork.textColor1 || 'ffffff';
    return {
      'box-shadow': `0.2rem 0.2rem 1rem #${shadowColor}`
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

  get coverSmStyle() {
    return {
      'margin-right': this.isFromAlbum ? '10rem' : '0'
    };
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.relatedAlbums = [];
    this.otherAlbumsFromArtists = [];
    this.songs = [];
    this.fetchCollection();
  }

  created() {
    this.setFooterVisibility(false);
    this.fetchCollection();
  }

  beforeDestroy() {
    this.setFooterVisibility(true);
  }

  fetchCollection() {
    this.collection = null;

    switch (this.collectionType) {
      case CollectionType.album:
        this.fetchOneAlbumCatalog(this.id)
          .then(collection => {
            this.collection = collection;
            this.$_fetchAlbumExtraInfo(collection);
            this.$_getSongsFromCollection(collection);
            this.$_getBackgroundGradients();
          })
          .finally(() => this.dataLoadingDone());

        break;

      case CollectionType.playlist:
        this.fetchOnePlaylistCatalog(this.id)
          .then(collection => {
            this.collection = collection;
            this.$_getSongsFromCollection(collection);
            this.$_getBackgroundGradients();
          })
          .finally(() => this.dataLoadingDone());
        break;

      case CollectionType.libraryAlbum:
        this.fetchOneAlbumLibrary(this.id)
          .then(collection => {
            this.collection = collection;
            this.$_getSongsFromCollection(collection);
            this.$_getBackgroundGradients();
          })
          .finally(() => this.dataLoadingDone());
        break;

      case CollectionType.libraryPlaylist:
        this.fetchOnePlaylistLibrary(this.id).then(collection => {
          this.collection = collection;
          this.$_getBackgroundGradients();
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

    // this.playCollection({
    //   collectionId: this.id,
    //   collectionType: this.collection.type,
    //   startPosition: songIndex
    // });

    this.playSongs({
      songs: this.songs,
      sourceInfo: {
        name: this.collection.attributes!.name,
        path: {
          name: this.collection.type,
          params: {
            id: this.collection.id
          }
        }
      },
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
}
</script>

<style lang="scss" module>
.left-column {
  display: flex;
  border-radius: 20px;
  height: calc(100vh - 64px - 24px - 16px);
  max-height: 80rem;
  position: sticky;
  top: 88px;
  flex-wrap: nowrap;
  flex-direction: column;
}

.left-column__top {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 4rem;
}

.left-column__bottom {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 4rem;
}

.cover-wrapper {
  position: relative;
  width: 100%;
  max-width: 50vh;
  margin-right: -4rem;
  margin-left: 4rem;
}

.cover-wrapper:before {
  content: '';
  display: block;
  padding-top: 100%; /* initial ratio of 1:1*/
}

.cover {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  border-radius: 2rem;
}

.right-column {
  padding-left: 6.6rem;
}

.collection-description {
  color: var(--v-secondaryText-base);
  font-size: 1.4rem;
}

.collection-description-toggle {
  font-weight: bold;
  cursor: pointer;
}

.song-info {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
}

.collection-name {
  font-weight: bold;
  color: white;
  overflow: hidden;
}

@supports (-webkit-line-clamp: 2) {
  .collection-name,
  .artist-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    margin-bottom: 0.8rem;
  }
}

@supports not (-webkit-line-clamp: 2) {
  .collection-name,
  .artist-name {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.artist-name {
  color: white;
  overflow: hidden;
}

.artist-name a {
  color: white;
}

.artist-name a:hover {
  font-weight: bold;
  text-decoration: underline;
}

.cover-sm {
  width: 20rem;
  height: 20rem;
  flex-shrink: 0;
  position: relative;
  max-width: 20rem;
}

.cover-sm:before {
  content: '';
  display: block;
  padding-top: 100%;
}

.collection-date {
  color: #bdbdbd;
}
</style>
