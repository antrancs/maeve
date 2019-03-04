<template>
  <v-hover>
    <v-card class="secondary elevation-8 item-card" slot-scope="{ hover }">
      <MediaArtwork :artwork="artwork" :width="220" :height="220">
        <template v-if="hover || isCollectionBeingPlayed">
          <div class="overlay"></div>
          <v-btn
            icon
            round
            @click.prevent.stop="playCollection"
            color="accent elevation-5"
            class="play-button"
          >
            <v-icon v-if="isCollectionBeingPlayed && musicPlayer.isPlaying"
              >pause</v-icon
            >
            <v-icon v-else>play_arrow</v-icon>
          </v-btn>
        </template>
        <div class="top-icon pa-2"><slot></slot></div>
      </MediaArtwork>

      <v-card-title primary-title class="py-2 px-2">
        <div>
          <div class="media-details__title">
            <div
              class="long-text-truncated main-info-text card-text"
              :style="{ color: primaryTextSecondaryColor }"
              :title="collection.attributes.name"
            >
              {{ collection.attributes.name }}
            </div>
            <v-icon
              v-if="collection.attributes.contentRating === 'explicit'"
              class="ml-1"
              small
              >explicit</v-icon
            >
          </div>
          <div
            class="long-text-truncated sub-info-text card-text"
            :style="{ color: secondaryTextSecondaryColor }"
            :title="
              collection.attributes.artistName ||
                collection.attributes.curatorName
            "
          >
            {{
              collection.attributes.artistName ||
                collection.attributes.curatorName
            }}
          </div>
        </div>
      </v-card-title>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';

import MediaArtwork from '@/components/MediaArtwork.vue';
import { Collection, Nullable, Song } from '@/@types/model/model';
import {
  MusicPlayerState,
  FetchOneAlbumCatalogAction,
  FetchOnePlaylistCatalogAction,
  PlaySongsAction,
  FetchOneAlbumLibraryAction,
  FetchOnePlaylistLibraryAction
} from '@/store/types';
import {
  TOGGLE_CURRENT_TRACK,
  PAUSE_CURRENT_TRACK,
  FETCH_ONE_ALBUM_CATALOG,
  FETCH_ONE_PLAYLIST_CATALOG,
  PLAY_SONGS,
  FETCH_ONE_ALBUM_LIBRARY,
  FETCH_ONE_PLAYLIST_LIBRARY
} from '@/store/actions.type';
import {
  isLight,
  TEXT_PRIMARY_LIGHT,
  TEXT_PRIMARY_DARK,
  TEXT_SECONDARY_LIGHT,
  TEXT_SECONDARY_DARK
} from '@/themes';
import { getSongsFromCollection } from '@/utils/utils';

@Component({
  components: { MediaArtwork }
})
export default class CollectionItemCard extends Vue {
  @Prop()
  collection!: Collection;

  @State
  musicPlayer!: MusicPlayerState;

  @Action
  [PLAY_SONGS]: PlaySongsAction;
  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;
  @Action [PAUSE_CURRENT_TRACK]: () => void;
  @Action [FETCH_ONE_ALBUM_CATALOG]: FetchOneAlbumCatalogAction;
  @Action [FETCH_ONE_PLAYLIST_CATALOG]: FetchOnePlaylistCatalogAction;
  @Action [FETCH_ONE_ALBUM_LIBRARY]: FetchOneAlbumLibraryAction;
  @Action [FETCH_ONE_PLAYLIST_LIBRARY]: FetchOnePlaylistLibraryAction;

  get isCollectionBeingPlayed(): boolean {
    if (!this.musicPlayer.currentCollectionId) {
      return false;
    }
    return this.musicPlayer.currentCollectionId === this.collection.id;
  }

  get artworkOverlayClass(): object {
    return {
      playing: this.isCollectionBeingPlayed
    };
  }

  get artwork() {
    if (!this.collection || !this.collection.attributes) {
      return null;
    }
    return this.collection.attributes.artwork;
  }

  get primaryTextSecondaryColor() {
    return isLight(this.$vuetify.theme.secondary as string)
      ? TEXT_PRIMARY_LIGHT
      : TEXT_PRIMARY_DARK;
  }

  get secondaryTextSecondaryColor() {
    return isLight(this.$vuetify.theme.secondary as string)
      ? TEXT_SECONDARY_LIGHT
      : TEXT_SECONDARY_DARK;
  }

  async playCollection() {
    if (this.isCollectionBeingPlayed) {
      this.toggleCurrentTrack();
      return;
    }

    this.pauseCurrentTrack();

    // if this collection already has a 'tracks' relationship, just play it
    if (
      this.collection &&
      this.collection.relationships &&
      this.collection.relationships.tracks
    ) {
      this.$_playTracksFromCollection(this.collection);
      return;
    }

    // fetch 'tracks' relationships of the current collection to play

    let collection: Nullable<Collection> = null;
    switch (this.collection.type) {
      case 'albums':
        collection = await this.fetchOneAlbumCatalog(this.collection.id);
        break;

      case 'playlists':
        collection = await this.fetchOnePlaylistCatalog(this.collection.id);
        break;

      case 'library-albums':
        collection = await this.fetchOneAlbumLibrary(this.collection.id);
        break;

      case 'library-playlists':
        collection = await this.fetchOnePlaylistLibrary(this.collection.id);
        break;
    }

    const songs = getSongsFromCollection(collection);
    this.playSongs({
      collectionId: this.collection.id,
      songs: songs,
      songsSourceName: this.collection.attributes
        ? this.collection.attributes.name
        : ''
    });
  }

  $_playTracksFromCollection(collection: Collection) {
    if (collection.relationships && collection.relationships.tracks) {
      this.playSongs({
        collectionId: collection.id,
        songs: collection.relationships.tracks.data,
        songsSourceName: collection.attributes ? collection.attributes.name : ''
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  bottom: 0;
}

.play-button {
  position: absolute;
  bottom: 0;
  right: 0;
}

.media-details__title {
  align-items: center;
  display: flex;
}

.top-icon {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
