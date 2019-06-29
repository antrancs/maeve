<template>
  <div>
    <div class="text-xs-center">
      <h2>{{ artistName }}</h2>
      <div v-if="albums" class="sub-info-text">
        {{ albums.length }} {{ albums.length > 1 ? 'albums' : 'album' }},
        {{ totalSongs.length }} songs
      </div>
    </div>

    <div v-if="albums" class="text-xs-center my-2">
      <app-button @on-click="() => playAllSongs(false)">Play</app-button>
      <app-button @on-click="() => playAllSongs(true)">Shuffle</app-button>
    </div>
    <transition-group name="list" tag="div" class="layout row wrap">
      <template v-if="albums">
        <v-flex
          xs6
          sm6
          md6
          lg4
          v-for="album in albums"
          :key="album.id"
          class="pa-2"
          :class="$style['album-item']"
          @click="$emit('on-album-clicked', album.id)"
        >
          <CollectionItemCard :collection="album" />
        </v-flex>
      </template>
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Watch, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import CollectionItemCard from '@/components/Collection/CollectionItemCard.vue';
import { FETCH_ONE_ALBUM_LIBRARY, PLAY_SONGS } from '@/store/actions.type';
import { FetchOneAlbumLibraryAction, PlaySongsAction } from '@/store/types';
import { Nullable, Song } from '@/@types/model/model';
import { getSongsFromCollection } from '@/utils/utils';

@Component({
  components: {
    CollectionItemCard
  }
})
export default class LibraryArtistAlbums extends Vue {
  private albums: Nullable<MusicKit.LibraryAlbum[]> = null;

  @Prop() albumIds!: string[];
  @Prop() artistName!: string;

  @Action [FETCH_ONE_ALBUM_LIBRARY]: FetchOneAlbumLibraryAction;
  @Action
  [PLAY_SONGS]: PlaySongsAction;

  @Watch('albumIds')
  onAlbumIdsChanged(newValue: string[]) {
    this.$_fetchAlbums();
  }

  // get all song Ids from all albums
  get totalSongs(): Song[] {
    if (!this.albums) {
      return [];
    }

    let allSongs: Song[] = [];

    this.albums.forEach(album => {
      const songs = getSongsFromCollection(album);
      allSongs.push(...songs);
    });

    return allSongs;
  }

  created() {
    this.$_fetchAlbums();
  }

  $_fetchAlbums() {
    const promises = this.albumIds.map(id => this.fetchOneAlbumLibrary(id));

    Promise.all(promises).then(albums => {
      this.albums = albums;
    });
  }

  playAllSongs(shuffle: boolean) {
    this.playSongs({
      songs: this.totalSongs,
      sourceInfo: {
        name: `${this.artistName}'s songs`,
        path: {
          name: 'myLibraryArtists'
        }
      },
      shuffle
    });
  }
}
</script>

<style lang="scss" module>
.album-item {
  cursor: pointer;
}
</style>
