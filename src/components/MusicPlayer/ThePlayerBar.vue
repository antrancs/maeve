<template>
  <PlayerFullScreen>
    <div
      v-if="musicPlayer.currentPlaying"
      :class="['secondary', $style['wrapper']]"
    >
      <v-layout row fill-height>
        <img
          v-if="currentTrackArtwork"
          :class="['hidden-xs-only', $style['song-artwork']]"
          :src="currentTrackArtwork"
          alt="Song artwork"
        />
        <v-flex fill-height>
          <v-layout column fill-height>
            <PlayerProgressBar />
            <v-layout row align-center class="mx-2">
              <v-flex
                xs8
                sm8
                md3
                :class="{ 'pr-2': $vuetify.breakpoint.xsOnly }"
                :style="primaryStyle"
              >
                <div
                  :class="[$style['song-name'], 'long-text-truncated', 'mb-1']"
                >
                  {{ songName }}
                </div>
                <div class="long-text-truncated">{{ artistName }}</div>
              </v-flex>

              <v-flex xs4 sm4 md4>
                <v-layout
                  row
                  align-center
                  :justify-center="$vuetify.breakpoint.mdAndUp"
                  :justify-end="$vuetify.breakpoint.smAndDown"
                  :class="{
                    [$style['btn-groups-small-device']]:
                      $vuetify.breakpoint.xsOnly
                  }"
                >
                  <PlayPreviousButton v-if="$vuetify.breakpoint.mdAndUp" />
                  <PlayButton :size="50" />
                  <PlayNextButton />

                  <v-btn
                    v-if="$vuetify.breakpoint.mdAndUp"
                    icon
                    @click.stop="updateRepeatMode"
                  >
                    <v-icon
                      medium
                      :color="repeatIconColor"
                      :style="primaryStyle"
                      >{{ repeatIcon }}</v-icon
                    >
                  </v-btn>
                </v-layout>
              </v-flex>

              <v-flex md5 v-if="$vuetify.breakpoint.mdAndUp">
                <v-layout row align-center justify-end>
                  <LyricsDialog v-if="isAuthenticated">
                    <v-btn small round outline color="accent">Lyrics</v-btn>
                  </LyricsDialog>
                  <div :style="secondaryTextStyle">
                    {{
                      musicPlayer.currentPlaybackTimeInMilliSeconds
                        | formattedDuration
                    }}
                    /
                    <span>
                      {{ currentPlayingDuration | formattedDuration }}
                    </span>
                  </div>

                  <PlayerVolume :width="110" />

                  <v-btn icon @click.stop="toggleQueueVisibility">
                    <v-icon medium :style="primaryStyle">playlist_play</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </PlayerFullScreen>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { State, Action, Getter, Mutation } from 'vuex-class';

import LyricsDialog from '@/components/LyricsDialog.vue';
import PlayerProgressBar from './PlayerProgressBar.vue';
import PlayerFullScreen from './PlayerFullScreen.vue';
import PlayNextButton from './PlayNextButton.vue';
import PlayPreviousButton from './PlayPreviousButton.vue';
import PlayButton from './PlayButton.vue';
import PlayerVolume from './PlayerVolume.vue';
import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import { MusicPlayerState } from '@/store/types';
import {
  TOGGLE_SHUFFLE_MODE,
  TOGGLE_QUEUE_VISIBILITY,
  UPDATE_REPEAT_MODE
} from '@/store/actions.type';
import { Nullable } from '@/@types/model/model';
import { RepeatMode } from '@/utils/constants';

@Component({
  components: {
    LyricsDialog,
    PlayerProgressBar,
    PlayNextButton,
    PlayPreviousButton,
    PlayButton,
    PlayerVolume,
    PlayerFullScreen
  }
})
export default class PlayerBar extends Mixins(PlayerBarColorMixin) {
  private playerFullScreenVisible = false;
  @State musicPlayer!: MusicPlayerState;

  @Getter currentTrackArtwork!: Nullable<string>;
  @Getter currentPlayingDuration!: number;
  @Getter isAuthenticated!: boolean;

  @Action
  [TOGGLE_SHUFFLE_MODE]: () => void;
  @Action
  [UPDATE_REPEAT_MODE]: () => void;
  @Action
  [TOGGLE_QUEUE_VISIBILITY]: () => void;

  get artistName(): string {
    return this.musicPlayer.currentPlaying
      ? this.musicPlayer.currentPlaying.artistName
      : '';
  }

  get songName(): string {
    return this.musicPlayer.currentPlaying
      ? this.musicPlayer.currentPlaying.title
      : '';
  }

  get repeatIcon(): string {
    return this.musicPlayer.repeatMode === RepeatMode.One
      ? 'repeat_one'
      : 'repeat';
  }

  get repeatIconColor(): string {
    return this.musicPlayer.repeatMode !== RepeatMode.Off ? 'accent' : '';
  }

  handleShuffleClicked() {
    this.toggleShuffleMode();
  }

  showPlayerFullScreen() {
    this.playerFullScreenVisible = true;

    // @ts-ignore
    // this.$refs.playerFullScreen.open();
  }
}
</script>

<style lang="scss" module>
.wrapper {
  border-top: 0.1rem solid black;
  bottom: 0;
  height: $player-bar-height;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 5;
}

.song-artwork {
  height: $player-bar-height;
  width: $player-bar-height;
}

.song-name {
  font-weight: bold;
}

.btn-groups-small-device button {
  margin: 0;
}
</style>

<style lang="scss">
.progress-bar-wrapper:not(.progress-bar-mouse-over) .v-slider__thumb {
  display: none;
}
</style>
