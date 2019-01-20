<template>
  <v-layout row>
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
          <v-icon dark v-if="collection.attributes.contentRating === 'explicit'"
            >explicit</v-icon
          >
        </h2>

        <div
          :style="headerOverlayTextStyle"
          :class="[
            $style['collection-subtitle'],
            $style['collection-artist-name']
          ]"
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
          :class="['mb-2', $style['collection-subtitle']]"
          :style="headerOverlaySecondaryTextStyle"
        >
          <span
            v-if="
              collection.type !== 'library-playlists' &&
                collection.type !== 'library-albums'
            "
            >{{ releaseYear }} •</span
          >
          {{ numberOfSongs }} tracks
        </div>

        <div class="hidden-xs-only">
          <template v-if="collection">
            <CollectionControls :collection="collection" />
          </template>
        </div>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CollectionControls from './CollectionControls.vue';
import { Prop } from 'vue-property-decorator';

import MediaArtwork from './MediaArtwork.vue';
import {
  Collection,
  Nullable,
  Artist,
  CollectionType
} from '@/@types/model/model';
import { TEXT_PRIMARY_DARK, TEXT_SECONDARY_DARK } from '@/themes';

@Component({
  components: {
    MediaArtwork,
    CollectionControls
  }
})
export default class CollectionHeader extends Vue {
  @Prop() collection!: Nullable<Collection>;
  @Prop() artworkSize!: number;
  @Prop() numberOfSongs!: number;

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

  get artworkStyle() {
    return {
      width: `${this.artworkSize}px`,
      height: `${this.artworkSize}px`
    };
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

  get artistId(): Nullable<string> {
    if (this.artists.length === 0) {
      return null;
    }
    return this.artists[0].id;
  }

  get releaseYear(): string {
    if (!this.collection || !this.collection.attributes) {
      return '';
    }

    let year = '';
    switch (this.collection.type) {
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
}
</script>

<style lang="scss" module>
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
</style>
