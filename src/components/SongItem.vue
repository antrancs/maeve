<template>
  <div class="song-item" @click="play">
    <div class="song-item__left">
      <div class="song-item__track-number">
        <div v-if="collectionType === 'albums'">{{ song.trackNumber }}</div>
        <img v-else class="artwork" :src="artworkUrl" alt="">
        <div class="track-number__overlay">
          <icon class="icon" name="play"></icon>
        </div>
      </div>
      <div>{{ song.name }}</div>
    </div>

    <div class="song-item__middle">
      <div class="text-height--one-line">{{ song.artistName }}</div>
      <div
        v-if="collectionType === 'playlists'"
        class="text-height--one-line"
      >
        {{ song.albumName }}
      </div>
    </div>

    <div class="song-item__right">
      <div class="option">
        <icon class="icon" name="ellipsis-v"></icon>
      </div>
      <div>{{ song.durationInMillis | formatSongDuration }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import 'vue-awesome/icons/ellipsis-v';
import 'vue-awesome/icons/play';
import Icon from 'vue-awesome/components/Icon.vue';
import { getArtworkUrl } from '@/utils/utils';

@Component({
  components: { Icon },
  filters: {
    formatSongDuration(value: number) {
      if (!value) {
        return '0:00';
      }
      const durationInSeconds = Math.floor(value / 1000);
      const NUMBER_OF_SECONDS_IN_A_MINUTE = 60;
      const minutes = Math.trunc(
        durationInSeconds / NUMBER_OF_SECONDS_IN_A_MINUTE
      );
      const seconds = durationInSeconds % NUMBER_OF_SECONDS_IN_A_MINUTE;
      return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
    }
  }
})
export default class SongItem extends Vue {
  @Prop() song!: any;
  @Prop() collectionType!: string;

  get artworkUrl() {
    return getArtworkUrl(this.song.artwork.url, 50, 50);
  }

  play() {
    console.log('Playing song');
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_song-item.scss';

.artwork {
  max-width: 3rem;
}
</style>
