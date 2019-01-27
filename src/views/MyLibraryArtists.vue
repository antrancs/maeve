<template>
  <v-container>
    <v-layout v-if="artists" row wrap>
      <v-flex
        sm5
        md6
        :class="[$style['column'], { 'pr-4': !albumClicked }]"
        :style="[columnStyleHeight, artistColumnStyle]"
      >
        <div
          :key="artist.id"
          v-for="artist in artists"
          :class="$style['artist-item']"
          @click="() => handleArtistItemClicked(artist.id)"
        >
          <img :src="placeHolderImage" :class="$style['artist-avatar']" />
          <div :class="[$style['artist-name-wrapper'], 'ml-2']">
            <div :class="$style['artist-name']">
              {{ artist.attributes ? artist.attributes.name : '' }}
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex
        md6
        :class="($style['column'], { sm7: !albumClicked, sm4: albumClicked })"
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

        <template v-if="selectedArtist">
          <h2 class="text-xs-center">
            {{ this.selectedArtist.attributes.name }}
          </h2>
          <transition-group name="list" tag="div" class="layout row wrap">
            <v-flex
              xs6
              sm6
              md6
              lg4
              v-for="album in selectedArtistAlbums"
              :key="album.id"
              class="pa-2"
              :class="$style['album-item']"
              @click="() => handleAlbumClicked(album.id)"
            >
              <CollectionItemCard :collection="album" />
            </v-flex>
          </transition-group>
        </template>
      </v-flex>

      <v-flex
        sm8
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
            :tracks="selectedAlbum.relationships.tracks.data"
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

import CollectionItemCard from '@/components/CollectionItemCard.vue';
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
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { SET_FOOTER_VISIBILITY } from '@/store/mutations.type';

@Component({
  components: {
    CollectionItemCard,
    CollectionHeader,
    SongListSmall
  }
})
export default class MyLibraryArtists extends Vue {
  private artists: Nullable<MusicKit.LibraryArtist[]> = null;
  private offset = 0;
  private searchLimit = 20;
  private placeHolderImage = PLACEHOLDER_IMAGE;
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

  get selectedArtistAlbums() {
    if (!this.selectedArtist) {
      return [];
    }

    return this.selectedArtist.relationships
      ? this.selectedArtist.relationships.albums!.data
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
    this.selectedArtist = null;
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
.artist-item {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 6rem;
}

.artist-avatar {
  width: 4rem;
  height: 4rem;
}

.artist-name {
  font-size: 1.8rem;
}

.artist-name-wrapper {
  align-items: center;
  border-bottom: 0.5px solid var(--v-secondaryText-base);
  display: flex;
  height: 100%;
  flex: 1;
}

.column {
  overflow-y: scroll;
  transition: max-width 0.2s ease;
}

.album-detail-column {
  transition: opacity 0.2s ease;
}

.album-item {
  cursor: pointer;
}

.back-button {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
