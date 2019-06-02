<template>
  <div>
    <CollectionHeader :collection="album" :songs="songs" :artworkSize="150" />

    <SongListSmall
      class="mt-4"
      :songs="songs"
      :fromAlbum="true"
      :onSongClicked="handleSongClicked"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Prop } from 'vue-property-decorator';

import CollectionHeader from '@/components/Collection/CollectionHeader.vue';
import SongListSmall from '@/components/Song/SongListSmall.vue';
import { getSongsFromCollection } from '@/utils/utils';
import { Action } from 'vuex-class';
import { PLAY_COLLECTION, PLAY_SONGS } from '../../../store/actions.type';
import { PlayCollectionAction, PlaySongsAction } from '../../../store/types';

@Component({
  components: {
    CollectionHeader,
    SongListSmall
  }
})
export default class LibraryArtistAlbumDetail extends Vue {
  @Prop() album!: MusicKit.LibraryAlbum;

  // @Action [PLAY_COLLECTION]: PlayCollectionAction;
  @Action [PLAY_SONGS]: PlaySongsAction;

  get songs() {
    return getSongsFromCollection(this.album);
  }

  handleSongClicked(songId: string, songIndex: number) {
    // this.playCollection({
    //   collectionId: this.album.id,
    //   collectionType: this.album.type,
    //   startPosition: songIndex
    // });
    this.playSongs({
      songs: this.songs,
      sourceInfo: {
        name: this.album.attributes!.name,
        path: {
          name: 'albums',
          params: {
            id: this.album.id
          }
        }
      },
      startPosition: songIndex
    });
  }
}
</script>
