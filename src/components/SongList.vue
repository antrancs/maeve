<template>
  <div class="song-list">
    <song-item
      :key="track.id"
      v-for="(track, index) in tracks"
      :track="track"
      :index="index"
      :is-from-album="isFromAlbum"
      :on-song-item-clicked="handleSongItemClicked"
      :is-playlist="isPlaylist"
    >
    </song-item>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

import { CollectionType } from '@/services/musicApi.service';
import { Collection } from '@/@types/model/model';
import { PlayCollectionAtIndexAction } from '@/store/types';
import { MusicPlayerState } from '@/store/types';
import SongItem from './SongItem.vue';

@Component({
  components: { SongItem }
})
export default class SongList extends Vue {
  @Prop() collection!: Collection | undefined;
  @Prop() tracks!: MusicKit.SongResource[];
  @Prop({ default: false })
  isPlaylist!: boolean;

  @State musicPlayer!: MusicPlayerState;

  @Action playCollectionAtIndex!: PlayCollectionAtIndexAction;
  @Action toggleCurrentTrack!: () => void;

  get isFromAlbum(): boolean {
    return (
      this.collection !== undefined &&
      this.collection.type === CollectionType.album
    );
  }

  handleSongItemClicked(index: number): void {
    // the clicked song is being played, just toggle the current track
    if (
      this.musicPlayer.currentPlaying &&
      this.musicPlayer.currentPlaying.id === this.tracks[index].id
    ) {
      this.toggleCurrentTrack();
      return;
    }

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

.song-list {
  color: $fg-color-4;
  width: 100%;
}

.icon-playing {
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 50;
}
</style>
