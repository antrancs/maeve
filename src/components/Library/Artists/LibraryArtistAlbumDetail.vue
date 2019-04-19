<template>
  <div>
    <CollectionHeader :collection="album" :songs="songs" :artworkSize="150" />

    <SongListSmall class="mt-4" :songs="songs" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Prop } from 'vue-property-decorator';
import CollectionHeader from '@/components/Collection/CollectionHeader.vue';
import SongListSmall from '@/components/Song/SongListSmall.vue';
import { getSongsFromCollection } from '@/utils/utils';

@Component({
  components: {
    CollectionHeader,
    SongListSmall
  }
})
export default class LibraryArtistAlbumDetail extends Vue {
  @Prop() album!: MusicKit.LibraryAlbum;

  get songs() {
    return getSongsFromCollection(this.album);
  }
}
</script>
