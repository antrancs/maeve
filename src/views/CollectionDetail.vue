<template>
  <v-container fill-height class="pb-0">
    <v-layout row wrap>
      <v-flex md4 lg3 v-if="$vuetify.breakpoint.mdAndUp">
        <div
          :class="$style['left-column']"
          :style="[leftColumnBackgroundStyle]"
          v-if="collection"
        >
          <div :class="[$style['left-column__top'], 'pr-2 py-2']">
            <div
              :class="$style['collection-name']"
              :style="collectionNameStyle"
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
              :class="$style['cover']"
              :style="artworkStyle"
              :artworks="artworks"
            />
          </div>

          <div :class="[$style['left-column__bottom'], 'pt-3']">
            <div :class="$style['song-info']">
              {{ songs.length }} {{ songs.length > 1 ? 'tracks' : 'track' }}
            </div>
            <div :class="$style['collection-date']">
              <template v-if="collection.type === 'albums'">
                Released: {{ releaseDate }}
              </template>
              <template v-else-if="collection.type === 'playlists'">
                Updated {{ updatedDate }}
              </template>
            </div>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 v-else class="mb-3">
        <v-layout row v-if="collection">
          <!-- <img
            
            :style="artworkStyle"
            :src="artworkUrl"
          /> -->
          <div :class="$style['cover-sm']">
            <CollectionDetailArtwork
              :class="$style['cover']"
              :artworks="artworks"
            />
          </div>
          <v-flex class="pl-3">
            <v-layout column>
              <div
                :class="$style['collection-name']"
                :style="collectionNameStyle"
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

      <v-flex
        xs12
        sm12
        md8
        lg9
        v-if="collection"
        :class="{ [$style['right-column']]: $vuetify.breakpoint.mdAndUp }"
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

        <v-layout row justify-end v-if="$vuetify.breakpoint.mdAndUp">
          <CollectionControls
            v-if="songs.length > 0"
            :collection="collection"
            :songs="songs"
          />
        </v-layout>
        <SongListLarge
          class="mt-2"
          :playlistId="playlistId"
          :sourceName="collectionName"
          :collectionId="collection.id"
          :songs="songs"
          :fromAlbum="isFromAlbum"
        />
      </v-flex>

      <v-flex xs12 v-if="otherAlbumsFromArtists.length > 0" class="mt-2">
        <h2 class="px-2">More by {{ collectionArtistName }}</h2>

        <SongCollectionList :collections="otherAlbumsFromArtists" />
      </v-flex>

      <v-flex xs12 v-if="relatedAlbums.length > 0" class="mt-2">
        <h2 class="px-2">Albums you might also like</h2>

        <SongCollectionList :collections="relatedAlbums" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { Action, Mutation, State } from 'vuex-class';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import isToday from 'date-fns/is_today';

import ResourceLinkList from '@/components/ResourceLinkList.vue';
import SongListLarge from '@/components/SongListLarge.vue';
import SongCollectionList from '@/components/SongCollectionList.vue';
import CollectionControls from '@/components/CollectionControls.vue';
import MediaArtwork from '@/components/MediaArtwork.vue';
import CollectionDetailArtwork from '@/components/Collection/CollectionDetailArtwork.vue';
import {
  Nullable,
  Collection,
  Artist,
  Album,
  CollectionType,
  Song,
  PlayQueueSong
} from '@/@types/model/model';

import {
  FETCH_ONE_ALBUM_CATALOG,
  FETCH_MULTILE_ALBUMS_CATALOG,
  FETCH_ONE_PLAYLIST_CATALOG,
  FETCH_ONE_ALBUM_LIBRARY,
  FETCH_ONE_PLAYLIST_LIBRARY,
  FETCH_ALBUM_EXTRA_INFO_CATALOG,
  FETCH_LIBRARY_PLAYLIST_TRACKS
} from '@/store/actions.type';
import {
  FetchOneAlbumCatalogAction,
  FetchMultipleAlbumsCatalogAction,
  FetchOnePlaylistCatalogAction,
  FetchOneAlbumLibraryAction,
  FetchOnePlaylistLibraryAction,
  FetchLibraryPlaylistTracksAction
} from '@/store/types';
import { SET_FOOTER_VISIBILITY } from '@/store/mutations.type';
import { getArtworkUrl } from '@/utils/utils';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { isLight } from '@/themes';
import { Route } from 'vue-router';

@Component({
  components: {
    MediaArtwork,
    SongListLarge,
    SongCollectionList,
    CollectionControls,
    ResourceLinkList,
    CollectionDetailArtwork
  }
})
export default class CollectionDetail extends Vue {
  private collection: Nullable<Collection> = null;
  private relatedAlbums: MusicKit.Album[] = [];
  private otherAlbumsFromArtists: MusicKit.Album[] = [];
  private editorialNoteCollapse = true;
  private songs: Song[] = [];

  @Prop() id!: string;

  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: PlayQueueSong | null;

  @Action [FETCH_ONE_ALBUM_CATALOG]: FetchOneAlbumCatalogAction;
  @Action [FETCH_MULTILE_ALBUMS_CATALOG]: FetchMultipleAlbumsCatalogAction;
  @Action [FETCH_ONE_PLAYLIST_CATALOG]: FetchOnePlaylistCatalogAction;
  @Action [FETCH_ONE_ALBUM_LIBRARY]: FetchOneAlbumLibraryAction;
  @Action [FETCH_ONE_PLAYLIST_LIBRARY]: FetchOnePlaylistLibraryAction;
  @Action [FETCH_LIBRARY_PLAYLIST_TRACKS]: FetchLibraryPlaylistTracksAction;
  @Action [FETCH_ALBUM_EXTRA_INFO_CATALOG]: (url: string) => Promise<any>;

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

  get artworks() {
    if (!this.collection || !this.collection.attributes) {
      return [PLACEHOLDER_IMAGE];
    }
    switch (this.collection.type) {
      case 'albums':
      case 'library-albums':
      case 'playlists':
        return [this.collection.attributes.artwork!.url];

      case 'library-playlists': {
        if (!this.collection.attributes.canEdit) {
          return [this.collection.attributes.artwork!.url];
        }
        const artworks: Set<string> = new Set<string>();
        for (const song of this.songs) {
          if (artworks.size === 4) {
            break;
          }
          if (!song.attributes || !song.attributes.artwork) {
            continue;
          }
          if (!artworks.has(song.attributes.artwork.url)) {
            artworks.add(song.attributes!.artwork!.url);
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
    if (
      !this.collection ||
      !this.collection.attributes ||
      !this.collection.attributes.artwork
    ) {
      return {};
    }
    const {
      bgColor,
      textColor1,
      textColor2,
      textColor3,
      textColor4
    } = this.collection.attributes.artwork;

    if (!bgColor) {
      return {
        background: 'linear-gradient(45deg, #FF5F6D, #FFC371)'
      };
    }
    if (isLight(bgColor)) {
      const firstColor = textColor1 || '000000';
      const secondColor = textColor3 || textColor2 || '000000';

      return {
        background: `linear-gradient(45deg, #${firstColor}, #${secondColor})`
      };
    }

    const secondColor = textColor2 || textColor1 || '000000';
    return {
      background: `linear-gradient(45deg, #${bgColor}, #${textColor2})`
    };
  }

  get artworkUrl(): string {
    if (
      !this.collection ||
      !this.collection.attributes ||
      !this.collection.attributes.artwork
    ) {
      return PLACEHOLDER_IMAGE;
    }
    return getArtworkUrl(this.collection.attributes.artwork.url, 400, 400);
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

      return format(parse(releaseDateStr), 'DD-MMM-YYYY');
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
        this.fetchOneAlbumCatalog(this.id).then(collection => {
          this.collection = collection;
          this.$_fetchAlbumExtraInfo(collection);
          this.$_getSongsFromCollection(collection);
        });

        break;
      case CollectionType.playlist:
        this.fetchOnePlaylistCatalog(this.id).then(collection => {
          this.collection = collection;
          this.$_getSongsFromCollection(collection);
        });
        break;
      case CollectionType.libraryAlbum:
        this.fetchOneAlbumLibrary(this.id).then(collection => {
          this.collection = collection;
          this.$_getSongsFromCollection(collection);
        });
        break;
      case CollectionType.libraryPlaylist:
        this.fetchOnePlaylistLibrary(this.id).then(collection => {
          this.collection = collection;
        });

        this.fetchLibraryPlaylistTracks(this.id).then(tracks => {
          this.songs = tracks;
        });
    }
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
  position: sticky;
  top: 88px;
  position: sticky;
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
  // background-color: red;
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
}

.artist-name {
  color: white;
}

.artist-name a {
  color: white;
}

.artist-name a:hover {
  font-weight: bold;
  text-decoration: underline;
}

.cover-sm {
  width: 15rem;
  height: 15rem;
  flex-shrink: 0;
  position: relative;
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
