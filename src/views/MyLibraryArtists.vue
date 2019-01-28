<template>
  <v-container>
    <v-layout v-if="artists" row wrap>
      <v-flex
        sm5
        md6
        :class="[$style['column'], { 'pr-4': !albumClicked }]"
        :style="[columnStyleHeight, artistColumnStyle]"
      >
        <LibraryArtistList
          v-if="artists"
          :artists="artists"
          @artist-item-clicked="handleArtistItemClicked"
        />
      </v-flex>

      <v-flex
        md6
        :class="[$style['column'], { sm7: !albumClicked, sm5: albumClicked }]"
        :style="columnStyleHeight"
      >
        <div :class="$style['back-button']">
          <v-btn
            v-if="albumClicked"
            @click="albumClicked = false"
            title="Back"
            icon
          >
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </div>
        <LibraryArtistAlbums
          v-if="selectedArtist"
          :albumIds="selectedArtistAlbumIds"
          :artistName="selectedArtist.attributes.name"
          @on-album-clicked="handleAlbumClicked"
        />
      </v-flex>

      <v-flex
        sm7
        md6
        :style="[columnStyleHeight, albumDetailColumnStyle]"
        :class="[$style['album-detail-column'], $style['column'], 'pl-2']"
      >
        <template v-if="selectedAlbum">
          <CollectionHeader
            :collection="selectedAlbum"
            :artworkSize="150"
            :numberOfSongs="10"
          />

          <SongListSmall
            class="mt-4"
            :collection="selectedAlbum"
            :isQueue="false"
          />
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action, Mutation, State } from 'vuex-class';
import Component from 'vue-class-component';

import LibraryArtistList from '@/components/Library/Artists/LibraryArtistList.vue';
import LibraryArtistAlbums from '@/components/Library/Artists/LibraryArtistAlbums.vue';
import CollectionHeader from '@/components/CollectionHeader.vue';
import SongListSmall from '@/components/SongListSmall.vue';
import {
  FETCH_LIBRARY_ARTISTS,
  FETCH_ONE_ARTIST_LIBRARY,
  FETCH_ONE_ALBUM_LIBRARY
} from '@/store/actions.type';
import {
  FetchLibraryArtistssActions,
  FetchOneAlbumLibraryAction
} from '@/store/types';
import { Nullable } from '@/@types/model/model';
import { SET_FOOTER_VISIBILITY } from '@/store/mutations.type';

@Component({
  components: {
    CollectionHeader,
    SongListSmall,
    LibraryArtistList,
    LibraryArtistAlbums
  }
})
export default class MyLibraryArtists extends Vue {
  private artists: Nullable<MusicKit.LibraryArtist[]> = null;
  private offset = 0;
  private searchLimit = 20;
  private albumClicked = false;
  private selectedAlbum: Nullable<MusicKit.LibraryAlbum> = null;
  private selectedArtist: Nullable<MusicKit.LibraryArtist> = null;

  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: MusicKit.MediaItem | null;

  @Action [FETCH_LIBRARY_ARTISTS]: FetchLibraryArtistssActions;
  @Action [FETCH_ONE_ARTIST_LIBRARY]!: (
    id: string
  ) => Promise<MusicKit.LibraryArtist>;
  @Action [FETCH_ONE_ALBUM_LIBRARY]: FetchOneAlbumLibraryAction;

  @Mutation [SET_FOOTER_VISIBILITY]: (visibility: boolean) => void;

  get columnStyleHeight() {
    if (this.currentPlaying) {
      return {
        'max-height': 'calc(100vh - 64px - 96px - 50px)'
      };
    }
    return {
      'max-height': 'calc(100vh - 64px - 50px)'
    };
  }

  get artistColumnStyle() {
    return this.albumClicked
      ? {
          'max-width': 0
        }
      : {};
  }

  get albumDetailColumnStyle() {
    return this.albumClicked
      ? { opacity: 1 }
      : {
          'max-width': 0,
          opacity: 0
        };
  }

  get selectedArtistAlbumIds(): string[] {
    if (!this.selectedArtist) {
      return [];
    }

    return this.selectedArtist.relationships
      ? this.selectedArtist.relationships.albums!.data.map(album => album.id)
      : [];
  }

  created() {
    this.setFooterVisibility(false);
    this.fetchLibraryArtists({
      offset: this.offset,
      limit: this.searchLimit
    }).then(result => {
      const { hasNext, hasNoData, data } = result;

      this.artists = data;
    });
  }

  beforeDestroy() {
    this.setFooterVisibility(true);
  }

  handleArtistItemClicked(artistId: string) {
    // this.selectedArtist = null;
    this.fetchOneArtistLibrary(artistId).then(artist => {
      this.selectedArtist = artist;
    });
  }

  handleAlbumClicked(albumId: string) {
    this.albumClicked = true;
    this.selectedAlbum = null;
    if (this.albumClicked) {
      this.fetchOneAlbumLibrary(albumId).then(libraryAlbum => {
        this.selectedAlbum = libraryAlbum;
      });
    }
  }
}
</script>

<style lang="scss" module>
.column {
  overflow-y: scroll;
  transition: max-width 0.2s ease;
}

.album-detail-column {
  transition: opacity 0.2s ease;
}

.back-button {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
