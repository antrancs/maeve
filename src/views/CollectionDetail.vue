<template>
  <div class="collection-detail">
    <div class="collection-detail-header" v-if="collection">
        <div class="banner-overlay">
          <div class="content-spacing content group-control">
            <img :src="getCollectionArtwork(300, 300)" class="collection-artwork"/>
          
            <div>
              <h2 class="collection-title">
                {{ collectionName }}
                <icon v-if="collection.attributes.contentRating === 'explicit'" name="explicit"/>
              </h2>
              <span class="collection-subtitle">
                {{ collectionArtistName }}
              </span>
              <span v-if="collectionType !== 'library-playlists'">
                -
                {{releaseYear}}
              </span>
              <div>
                {{ tracks.length }} tracks
              </div>
              <div class="group-control">
                <button @click="play" class="button">PLAY</button>
                <button class="button">SHUFFLE</button>
              </div>
            </div>
          </div>
        </div>
        <picture class="collection-detail-header__banner">
          <source
            media="(min-width: 1200px)"
            :srcset="getCollectionArtwork(1000, 1000)">

          <source
            media="(min-width: 900px)"
            :srcset="getCollectionArtwork(800, 800)">

          <source
            media="(min-width: 768px)"
            :srcset="getCollectionArtwork(540, 540)">

          <img
            class="image"
            :src="getCollectionArtwork(400, 400)"/>
        </picture>
    </div>

    <div class="content-spacing">
       <song-list
        :tracks="tracks"
        :collection="collection"
      >
      </song-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import SongList from '@/components/SongList.vue';
import { getArtworkUrl } from '@/utils/utils';
import musicApiService, { CollectionType } from '@/services/musicApi.service';
import { PlayCollectionAtIndexAction } from '@/store/types';
import { Collection, Song } from '@/@types/model/model';

@Component({
  components: { SongList }
})
export default class CollectionDetail extends Vue {
  collection: Collection | null = null;
  tracks: Song[] = [];

  @Action playCollectionAtIndex!: PlayCollectionAtIndexAction;

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

    return (
      (this.collection.attributes as MusicKit.AlbumAttributes).artistName ||
      (this.collection.attributes as MusicKit.PlaylistAttributes).curatorName ||
      ''
    );
  }

  get collectionType(): CollectionType {
    const path = this.$route.path;
    if (path.startsWith('/albums')) {
      return CollectionType.album;
    } else if (path.startsWith('/playlists')) {
      return CollectionType.playlist;
    } else if (path.startsWith('./library-playlists')) {
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

    let date = '';
    switch (this.collectionType) {
      case CollectionType.album:
        date = (this.collection
          .attributes as MusicKit.AlbumAttributes).releaseDate
          .toString()
          .substring(0, 4); // get year only
        break;

      case CollectionType.playlist:
        date = (this.collection
          .attributes as MusicKit.PlaylistAttributes).lastModifiedDate
          .toString()
          .substring(0, 4); // get year only
    }

    return date;
  }

  created() {
    const collectionId = this.$route.params.id;
    let promise: Promise<{ collection: Collection; tracks: Song[] } | null>;
    switch (this.collectionType) {
      case CollectionType.libraryPlaylist:
      case CollectionType.libraryAlbum:
        promise = musicApiService.getLibraryCollection(
          collectionId,
          this.collectionType
        );
        break;

      case CollectionType.album:
      case CollectionType.playlist:
        promise = musicApiService.getCollection(
          collectionId,
          this.collectionType
        );
        break;

      default:
        promise = Promise.reject('Invalid collection type');
    }
    promise.then(result => {
      if (!result) {
        return;
      }

      const { collection, tracks } = result;
      this.collection = collection;
      this.tracks = tracks;
    });
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

  play() {
    if (
      !this.collection ||
      !this.collection.attributes ||
      !this.collection.attributes.playParams
    ) {
      return;
    }

    const { id, kind } = this.collection.attributes.playParams;

    this.playCollectionAtIndex({
      collectionId: id,
      collectionType: kind,
      index: 0
    });
  }

  handleSongItemClicked(index: number) {
    if (
      !this.collection ||
      !this.collection.attributes ||
      !this.collection.attributes.playParams
    ) {
      return;
    }

    const { id, kind } = this.collection.attributes.playParams;

    this.playCollectionAtIndex({
      collectionId: id,
      collectionType: kind,
      index
    });
  }
}
</script>

<style lang="scss" scoped>
.collection-detail {
  width: 100%;
}

.collection-artwork {
  width: 20rem;
  height: 20rem;
}

.collection-detail-header {
  height: 40rem;
  margin-bottom: $xl-size;
  position: relative;
}

.banner-overlay {
  background-color: rgba($color: (#000000), $alpha: 0.6);
  height: 100%;
  position: relative;
  z-index: 40;
}

.content {
  align-items: flex-end;
  color: white;
  display: flex;
  height: 100%;
  padding-bottom: $l-size;
  position: relative;
  z-index: 50;
}

.collection-detail-header__banner {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.collection-title {
  font-size: 3rem;
  margin: 0 0 $s-size 0;
}

.collection-subtitle {
  color: $subtitle-color;
  font-size: 1.8rem;
}

.collection-artist {
}

.image {
  width: 100%;
  object-fit: cover;
}
</style>
