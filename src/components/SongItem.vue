<template>
  <div class="song-item" @click="play">
    <div class="song-item__left">
      <div class="song-item__track-number">
        <slot :track="track"></slot>
        <div class="track-number__overlay">
          <icon class="icon" name="play"></icon>
        </div>
      </div>
      <div>{{ track.attributes.name }}</div>
    </div>

    <div class="song-item__middle">
      <div class="text-height--one-line">{{ track.attributes.artistName }}</div>
      <div
        v-if="shouldShowAlbumName"
        class="text-height--one-line"
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
import Icon from 'vue-awesome/components/Icon.vue';

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
