<template>
  <div>
    <song-item
      :key="track.id"
      v-for="(track, index) in tracks"
      :track="track"
      :index="index"
      :shouldShowAlbumName="shouldShowAlbumName"
      @onSongItemClicked="handleSongItemClicked"
    >
      <template slot-scope="slotProps">
        <div v-if="isFromAlbum" class="track-number">
          {{ slotProps.track.attributes.trackNumber }}
        </div>
        <img
          v-else class="artwork"
          :src="getArtworkUrl(slotProps.track.attributes.artwork.url)"
          alt=""
        />
      </template>
    </song-item>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import { getArtworkUrl } from '@/utils/utils';
import { PlayCollectionAtIndexAction } from '@/store/types';
import SongItem from './SongItem.vue';
import { CollectionType } from '@/services/musicApi.service';
import { Collection } from '@/@types/model/model';

@Component({
  components: { SongItem }
})
export default class SongList extends Vue {
  @Prop() collection!: Collection | null;
  @Prop() tracks!: MusicKit.SongResource[];

  @Action playCollectionAtIndex!: PlayCollectionAtIndexAction;

  get isFromAlbum() {
    return this.collection && this.collection.type === CollectionType.album;
  }

  get shouldShowAlbumName() {
    return !this.collection || this.collection.type === CollectionType.playlist;
  }
  getArtworkUrl(artworkUrl: string) {
    return getArtworkUrl(artworkUrl, 50, 50);
  }

  handleSongItemClicked(index: number) {
    if (this.collection) {
      const { id, kind } = this.collection.attributes.playParams;
      this.playCollectionAtIndex({
        index,
        collectionId: id,
        collectionType: kind
      });
    } else {
      // Play items
    }
  }
}
</script>

<style lang="scss" scoped>
.artwork {
  max-width: 3rem;
}
</style>
