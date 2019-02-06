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
      <app-button @on-click="playAllSongs">Play</app-button>
      <app-button @on-click="shuffleAllSongs">Shuffle</app-button>
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
import Component from 'vue-class-component';
import shuffle from 'lodash/shuffle';

import CollectionItemCard from '@/components/CollectionItemCard.vue';
import { Prop, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
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

  playAllSongs() {
    this.playSongs({
      songs: this.totalSongs,
      startSongIndex: 0
    });
  }

  shuffleAllSongs() {
    const shuffledSongs = shuffle(this.totalSongs);

    this.playSongs({
      songs: shuffledSongs,
      startSongIndex: 0
    });
  }
}
</script>

<style lang="scss" module>
.album-item {
  cursor: pointer;
}
</style>
