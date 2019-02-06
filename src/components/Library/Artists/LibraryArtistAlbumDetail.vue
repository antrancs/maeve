<template>
  <div>
    <CollectionHeader :collection="album" :songs="songs" :artworkSize="150" />

    <SongListSmall class="mt-4" :songs="songs" :isQueue="false" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from 'vue-property-decorator';
import { Prop } from 'vue-property-decorator';
import CollectionHeader from '@/components/CollectionHeader.vue';
import SongListSmall from '@/components/SongListSmall.vue';
import CollectionSongsMixin from '@/mixins/CollectionSongsMixin';

@Component({
  components: {
    CollectionHeader,
    SongListSmall
  }
})
export default class LibraryArtistAlbumDetail extends Mixins(
  CollectionSongsMixin
) {
  @Prop() album!: MusicKit.LibraryAlbum;

  created() {
    this.getSongsDetail(this.album);
  }

  @Watch('album')
  onAlbumChanged(newValue: MusicKit.LibraryAlbum) {
    this.getSongsDetail(newValue);
  }
}
</script>
