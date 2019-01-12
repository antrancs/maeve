<template>
  <div
    :class="[$style['interact-layer']]"
    @mousedown.stop="handleMouseDown"
    @click.stop=""
  >
    <div :class="[$style['wrapper']]" ref="wrapperDiv">
      <div
        :class="$style['knob']"
        :style="{ left: `calc(${playbackProgress}% - 6px)` }"
      ></div>
      <div
        :class="$style['current-progress']"
        :style="{ width: playbackProgress + '%' }"
      ></div>

      <!-- <v-tooltip
        top
        :position-x="tooltipPosX"
        :position-y="tooltipPosY"
        :value="hover"
      >
        <span>{{ timeAtHoverPosition | formattedDuration }}</span>
      </v-tooltip> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Getter, Action, Mutation } from 'vuex-class';

import MediaArtwork from '@/components/MediaArtwork.vue';
import { MusicPlayerState } from '@/store/types';
import { setInterval, clearInterval } from 'timers';
import { Watch } from 'vue-property-decorator';
import { SEEK_TO_TIME } from '@/store/actions.type';
import { Nullable } from '@/@types/model/model';

@Component({
  components: {
    MediaArtwork
  }
})
export default class PlayerProgressBar extends Vue {
  private progress = 0;
  private tooltipPosX = 0;
  private tooltipPosY = 0;
  private timeAtHoverPosition = 0;
  // private setIntervalProgressId: Nullable<NodeJS.Timeout>;

  @State
  musicPlayer!: MusicPlayerState;

  @Getter currentPlayingDuration!: number;

  @Action [SEEK_TO_TIME]: (time: number) => void;

  get playbackProgress(): number {
    return this.musicPlayer.playbackProgress * 100;
  }

  // @Watch('musicPlayer.isPlaying')
  // onPlayingChanged(newValue: boolean, oldValue: boolean) {
  //   if (!newValue) {
  //     this.$_clearInterval();
  //   } else {
  //     this.$_setInterval();
  //   }
  // }

  // @Watch('musicPlayer.currentPlaybackTimeInMilliSeconds')
  // onCurrentPlaybackTimeChanged(newValue: number, oldValue: number) {
  //   if (newValue === 0) {
  //     this.progress = 0;
  //   }
  // }

  // @Watch('musicPlayer.currentPlaybackTimeAfterSkip')
  // onCurrentPlaybackTimeAfterSkipChanged(newValue: number) {
  //   // current playing in millisecond while currentPlaybackTimeAfterSkip in seconds
  //   this.progress = (newValue / (this.currentPlayingDuration / 1000)) * 100; // to percentage
  // }

  // $_setInterval() {
  //   this.progress = this.musicPlayer.playbackProgress * 100;
  //   if (this.progress >= 100) {
  //     this.progress = this.musicPlayer.playbackProgress * 100;
  //   }
  //   this.setIntervalProgressId = setInterval(() => {
  //     this.progress += 100 / (this.currentPlayingDuration / 1000) / 10;
  //     if (this.progress >= 100) {
  //       this.progress = this.musicPlayer.playbackProgress * 100;
  //     }
  //   }, 100);
  // }

  // $_clearInterval() {
  //   if (this.setIntervalProgressId) {
  //     clearInterval(this.setIntervalProgressId);
  //   }
  // }

  // beforeDestroy() {
  //   this.$_clearInterval();
  // }

  handleMouseDown(event: MouseEvent) {
    // @ts-ignore
    const bounds = event.target!.getBoundingClientRect();

    var x = event.clientX - bounds.left;
    this.tooltipPosX = event.clientX;
    this.tooltipPosY = event.clientY;

    // @ts-ignore
    const wrapperWidth = this.$refs.wrapperDiv.clientWidth;

    this.timeAtHoverPosition = this.currentPlayingDuration * (x / wrapperWidth);
    this.setTime();
  }

  setTime() {
    this.seekToTime(this.timeAtHoverPosition / 1000);
  }
}
</script>

<style lang="scss" module>
.interact-layer {
  cursor: pointer;
  height: 0.5rem;
  width: 100%;
}

.wrapper {
  background-color: var(--v-primary-lighten2);
  border-radius: 0.15rem;
  height: 0.3rem;
  position: relative;
}

.interact-layer:hover {
  .knob {
    opacity: 1;
  }
}

.current-progress {
  background-color: var(--v-accent-base);
  border-radius: inherit;
  height: 100%;
}

.knob {
  background-color: var(--v-accent-base);
  border-radius: 50%;
  height: 12px;
  opacity: 0;
  position: absolute;
  top: -4.5px;
  // transition: opacity 0.3s ease-in-out;
  width: 12px;
}
</style>
