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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter, Action, Mutation } from 'vuex-class';
import { Watch, Component } from 'vue-property-decorator';

import MediaArtwork from '@/components/MediaArtwork.vue';
import { MusicPlayerState, ScobbleLastfmAction } from '@/store/types';
import { SEEK_TO_TIME, SCROBBLE_LASTFM } from '@/store/actions.type';
import { Nullable } from '@/@types/model/model';

@Component({
  components: {
    MediaArtwork
  }
})
export default class PlayerProgressBar extends Vue {
  private timeAtHoverPosition = 0;

  @State
  musicPlayer!: MusicPlayerState;

  @Getter currentPlayingDuration!: number;
  @Getter isAuthenticated!: boolean;

  @Action [SEEK_TO_TIME]: (time: number) => void;
  @Action [SCROBBLE_LASTFM]: ScobbleLastfmAction;

  get playbackProgress(): number {
    return this.musicPlayer.playbackProgress * 100;
  }

  @Watch('musicPlayer.playbackProgress')
  onPlaybackProgresshanged(newValue: number, oldValue: number) {
    // Start to scrobble when the user has listened to half of the song
    if (newValue === 0.5 && this.isAuthenticated) {
      const { currentPlaying } = this.musicPlayer;

      if (!currentPlaying || !currentPlaying.attributes) {
        return;
      }
      this.scrobbleLastfm({
        artist: currentPlaying.attributes.artistName,
        track: currentPlaying.attributes.name,
        album: currentPlaying.attributes.albumName
      });
    }
  }

  handleMouseDown(event: MouseEvent) {
    // @ts-ignore
    const bounds = event.target!.getBoundingClientRect();

    var x = event.clientX - bounds.left;

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
