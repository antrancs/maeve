<template>
  <div class="collection-detail">
    <div class="collection-detail-header" v-if="collection">
      <div class="banner-overlay">
        <v-container fluid fill-height>
          <v-layout align-end row>
            <v-flex>
              <v-layout row wrap>
                <v-flex
                  shrink="true"
                  :d-flex="$vuetify.breakpoint.xsOnly"
                  :xs12="$vuetify.breakpoint.xsOnly"
                  :justify-center="$vuetify.breakpoint.xsOnly"
                >
                  <MediaArtwork
                    :artwork="collection.attributes.artwork"
                    :class="['collection-artwork']"
                    :width="300"
                    :height="300"
                    :has-shadow="true"
                  />
                </v-flex>
                <v-flex class="ml-3" :xs12="$vuetify.breakpoint.xsOnly">
                  <v-layout
                    column
                    justify-end
                    fill-height
                    :align-center="$vuetify.breakpoint.xsOnly"
                  >
                    <h2>
                      {{ collectionName }}
                      <v-icon
                        v-if="
                          collection.attributes.contentRating === 'explicit'
                        "
                        >explicit</v-icon
                      >
                    </h2>

                    <div
                      :class="['collection-subtitle', 'collection-artist-name']"
                    >
                      {{ collectionArtistName }}
                    </div>

                    <div class="collection-subtitle sub-info-text mb-2">
                      <span v-if="collectionType !== 'library-playlists'"
                        >{{ releaseYear }} •</span
                      >
                      {{ songs.length }} tracks
                    </div>

                    <div>
                      <v-btn
                        @click="playCollection"
                        :color="this.$vuetify.theme.accent"
                        class="ml-0"
                      >
                        {{ isCollectionBeingPlayed ? 'Pause' : 'Play' }}
                      </v-btn>
                      <v-btn
                        v-if="isAuthenticated"
                        @click="shuffleSongs"
                        :color="this.$vuetify.theme.accent"
                      >
                        Shuffle
                      </v-btn>
                    </div>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
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

    <v-container fluid>
      <SongList :tracks="songs" :collection="collection" />
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import { Action, Getter, State } from 'vuex-class';

import SongList from '@/components/SongList.vue';
import MediaArtwork from '@/components/MediaArtwork.vue';
import { getArtworkUrl } from '@/utils/utils';
import musicApiService from '@/services/musicApi.service';
import {
  PlayCollectionWithSongAction,
  FetchCollectionAction
} from '@/store/types';
import {
  Collection,
  Song,
  Nullable,
  CollectionType,
  HandleSongClicked
} from '@/@types/model/model';
import {
  FETCH_COLLECTION,
  PLAY_COLLECTION_WITH_SONG
} from '@/store/actions.type';

@Component({
  components: { SongList, MediaArtwork }
})
export default class CollectionDetail extends Vue {
  @State(state => state.collection.collection) collection: Nullable<Collection>;
  @State(state => state.musicPlayer.isPlaying)
  isPlaying!: boolean;

  @Getter
  songs!: Song[];
  @Getter
  isAuthenticated!: boolean;

  @Action
  [PLAY_COLLECTION_WITH_SONG]: PlayCollectionWithSongAction;
  @Action [FETCH_COLLECTION]!: FetchCollectionAction;

  @Provide()
  onSongItemClicked: HandleSongClicked = this.handleSongItemClicked;

  get isCollectionBeingPlayed(): boolean {
    if (!this.collection) {
      return false;
    }
    return (
      this.$store.getters.isCollectionBeingPlayed(this.collection.id) &&
      this.isPlaying
    );
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

  get collectionId(): string {
    return this.$route.params.id;
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

  created() {
    const collectionId = this.$route.params.id;
    this.fetchCollection({ collectionId, collectionType: this.collectionType });
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

  /**
   * Play the entire collection
   */
  playCollection() {
    // Start with the first song by default
    if (this.collection) {
      this.playCollectionWithSong({
        collection: this.collection
      });
    }
  }

  /**
   * Play a song based on its index or id from a collection
   * @param index Index of the song in the collection
   * @param songId Id of the the song
   */
  handleSongItemClicked(index: number, songId: string) {
    if (this.collection) {
      this.playCollectionWithSong({
        collection: this.collection,
        songId
      });
    }
  }

  /**
   * Shuffle the collection and play
   */
  shuffleSongs() {
    if (this.collection) {
      this.playCollectionWithSong({
        collection: this.collection,
        shuffle: true
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.collection-detail {
  width: 100%;
}

.collection-artwork {
  max-height: 15vh;
  max-width: 15vh;
  width: 12rem;
  height: 12rem;
}

.collection-detail-header {
  height: 40vh;
  margin-bottom: $xl-size;
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

.image {
  width: 100%;
  object-fit: cover;
}

@media (min-width: $bp-phone) {
  .collection-artwork {
    margin-bottom: 0;
    max-height: none;
    max-width: none;
    width: 20rem;
    height: 20rem;
  }

  .collection-title {
    font-size: 3rem;
  }

  .collection-detail-header {
    height: 60vh;
  }
}
</style>
