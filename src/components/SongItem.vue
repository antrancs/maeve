<template>
  <div class="song-item" @click="play">
    <div class="song-item__left">
      <div class="song-item__track-number">
        <slot :track="track"></slot>
        <div class="track-number__overlay">
          <icon class="icon" name="play"></icon>
        </div>
      </div>
      <div class="song-name long-text-truncated">
        {{ track.attributes.name }}
      </div>
      <icon
        class="explitcit-icon"
        v-if="track.attributes.contentRating === 'explicit'"
        name="explicit"
      />
    </div>

    <div class="song-item__middle">
      <div class="long-text-truncated song-item__artist-name">{{ track.attributes.artistName }}</div>
      <div
        v-if="shouldShowAlbumName"
        class="long-text-truncated song-item_album-name"
      >
        {{ track.attributes.albumName }}
      </div>
    </div>

    <div class="song-item__right">
      <div class="option">
        <icon class="icon" name="ellipsis-v"></icon>
      </div>
      <div>{{ track.attributes.durationInMillis | formatSongDuration }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import 'vue-awesome/icons/ellipsis-v';
import 'vue-awesome/icons/play';

@Component({
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
  @Prop() track!: MusicKit.SongResource;
  @Prop() shouldShowAlbumName!: boolean;
  @Prop() index!: number;

  play() {
    console.log('playing');
    this.$emit('onSongItemClicked', this.index);
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/_song-item.scss';

.artwork {
  max-width: 3rem;
}
</style>
