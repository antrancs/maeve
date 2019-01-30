<template>
  <div>
    <CollectionHeader
      :collection="album"
      :artworkSize="150"
      :numberOfSongs="numberOfSongs"
    />

    <SongListSmall class="mt-4" :collection="album" :isQueue="false" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import CollectionHeader from '@/components/CollectionHeader.vue';
import SongListSmall from '@/components/SongListSmall.vue';
import { getSongsFromCollection } from '@/utils/utils';
@Component({
  components: {
    CollectionHeader,
    SongListSmall
  }
})
export default class LibraryArtistAlbumDetail extends Vue {
  @Prop() album!: MusicKit.LibraryAlbum;
  get numberOfSongs(): number {
    return getSongsFromCollection(this.album).length;
  }
}
</script>
