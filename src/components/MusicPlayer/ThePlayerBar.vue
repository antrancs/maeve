<template>
  <div style="height: 0">
    <PlayQueue v-if="$vuetify.breakpoint.mdAndUp" />
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
                    :class="[
                      $style['song-name'],
                      'long-text-truncated',
                      'mb-1'
                    ]"
                    @click.stop="
                      () => goToAlbumPage(musicPlayer.currentPlaying)
                    "
                  >
                    {{ songName }}
                  </div>

                  <div :class="['long-text-truncated']">
                    <span
                      :class="$style['link-item']"
                      @click.stop="
                        () => goToArtistPage(musicPlayer.currentPlaying)
                      "
                    >
                      {{ artistName }}</span
                    >
                  </div>

                  <div
                    v-if="songContainerPath"
                    class="long-text-truncated"
                    style="cursor: default"
                  >
                    <small style="cursor: default">Playing from</small>
                    <template>
                      <router-link
                        @click.native="$event.stopImmediatePropagation()"
                        :to="songContainerPath.path"
                      >
                        <small :class="$style['link-item']">
                          {{ songContainerPath.name }}
                        </small>
                      </router-link>
                    </template>
                  </div>
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
                    <v-btn
                      v-if="$vuetify.breakpoint.mdAndUp"
                      icon
                      @click.stop="handleShuffleClicked"
                      title="Shuffle"
                    >
                      <v-icon
                        medium
                        :style="primaryStyle"
                        :color="shuffleIconColor"
                        >shuffle</v-icon
                      >
                    </v-btn>
                    <PlayPreviousButton v-if="$vuetify.breakpoint.mdAndUp" />
                    <PlayButton :size="50" />
                    <PlayNextButton />

                    <v-btn
                      v-if="$vuetify.breakpoint.mdAndUp"
                      icon
                      @click.stop="updateRepeatMode"
                      title="Repeat"
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
                      <v-icon medium :style="primaryStyle"
                        >playlist_play</v-icon
                      >
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
    </PlayerFullScreen>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { State, Action, Getter, Mutation } from 'vuex-class';

import LyricsDialog from '@/components/LyricsDialog.vue';
import PlayQueue from '@/components/PlayQueue/PlayQueue.vue';
import PlayerProgressBar from './PlayerProgressBar.vue';
import PlayerFullScreen from './PlayerFullScreen.vue';
import PlayNextButton from './PlayNextButton.vue';
import PlayPreviousButton from './PlayPreviousButton.vue';
import PlayButton from './PlayButton.vue';
import PlayerVolume from './PlayerVolume.vue';
import PlayerBarColorMixin from '@/mixins/PlayerBarColorMixin';
import GoToArtistPageMixin from '@/mixins/GoToArtistPageMixin';
import GoToAlbumPageMixin from '@/mixins/GoToAlbumPageMixin';
import { MusicPlayerState } from '@/store/types';
import {
  TOGGLE_QUEUE_VISIBILITY,
  UPDATE_REPEAT_MODE,
  TOGGLE_SHUFFLE_MODE,
  TOGGLE_CURRENT_TRACK,
  PLAY_NEXT,
  PLAY_PREVIOUS,
  CHANGE_VOLUME,
  MUTE_VOLUME
} from '@/store/actions.type';
import { Nullable, ShuffleMode, Artist } from '@/@types/model/model';
import { RepeatMode, PLACEHOLDER_IMAGE } from '@/utils/constants';
import {
  SET_IS_MUTED,
  SET_PLAYBACK_PROGESS,
  SET_IS_PLAYING,
  SET_SONG_LOADING,
  SET_CURRENT_PLAYBACK_TIME
} from '@/store/mutations.type';
import { getArtworkUrl } from '../../utils/utils';

@Component({
  components: {
    LyricsDialog,
    PlayerProgressBar,
    PlayNextButton,
    PlayPreviousButton,
    PlayButton,
    PlayerVolume,
    PlayerFullScreen,
    PlayQueue
  }
})
export default class PlayerBar extends Mixins(
  PlayerBarColorMixin,
  GoToArtistPageMixin,
  GoToAlbumPageMixin
) {
  private playerFullScreenVisible = false;

  @State musicPlayer!: MusicPlayerState;
  @State(state => state.musicPlayer.volume) volume!: number;
  @State(state => state.musicPlayer.isMuted) isMuted!: boolean;

  @Getter currentPlayingDuration!: number;
  @Getter isAuthenticated!: boolean;

  @Action
  [UPDATE_REPEAT_MODE]: () => void;
  @Action
  [TOGGLE_QUEUE_VISIBILITY]: () => void;
  @Action
  [TOGGLE_SHUFFLE_MODE]: () => void;
  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;
  @Action
  [PLAY_NEXT]: () => void;
  @Action
  [PLAY_PREVIOUS]: () => void;
  @Action [CHANGE_VOLUME]: (volume: number) => void;
  @Action [MUTE_VOLUME]: () => void;

  @Mutation
  [SET_PLAYBACK_PROGESS]: (progress: number) => void;
  @Mutation [SET_IS_MUTED]: () => void;
  @Mutation [SET_IS_PLAYING]: (isPlaying: boolean) => void;
  @Mutation [SET_SONG_LOADING]: (isLoading: boolean) => void;
  @Mutation [SET_CURRENT_PLAYBACK_TIME]: (time: number) => void;

  @Getter canGoBack!: boolean;
  @Getter canGoNext!: boolean;

  get artistName(): string {
    if (
      !this.musicPlayer.currentPlaying ||
      !this.musicPlayer.currentPlaying.attributes
    ) {
      return '';
    }
    return this.musicPlayer.currentPlaying.attributes.artistName;
  }

  get songName(): string {
    if (
      !this.musicPlayer.currentPlaying ||
      !this.musicPlayer.currentPlaying.attributes
    ) {
      return '';
    }
    return this.musicPlayer.currentPlaying.attributes.name;
  }

  get repeatIcon(): string {
    return this.musicPlayer.repeatMode === RepeatMode.One
      ? 'repeat_one'
      : 'repeat';
  }

  get repeatIconColor(): string {
    return this.musicPlayer.repeatMode !== RepeatMode.Off ? 'accent' : '';
  }

  get shuffleIconColor(): string {
    return this.musicPlayer.shuffleMode === ShuffleMode.On ? 'accent' : '';
  }

  get currentTrackArtwork() {
    if (
      !this.musicPlayer.currentPlaying ||
      !this.musicPlayer.currentPlaying.attributes
    ) {
      return PLACEHOLDER_IMAGE;
    }

    if (this.isAuthenticated) {
      return this.musicPlayer.currentPlaying.attributes.artwork.url.replace(
        '2000x2000bb',
        '100x100bb'
      );
    }

    return getArtworkUrl(
      this.musicPlayer.currentPlaying.attributes.artwork,
      100,
      100
    );
  }

  /* path to the container of the currently playing song,
It can be an album/playlist or the original song lists where this song is from
*/
  get songContainerPath() {
    if (!this.musicPlayer.currentPlaying) {
      return null;
    }

    const { container } = this.musicPlayer.currentPlaying;

    if (!container) {
      return null;
    }

    if (container.additionalInfo) {
      return container.additionalInfo.source;
    }

    if (!container.attributes) {
      return null;
    }

    return {
      name: container.attributes.name,
      path: {
        name: container.type,
        params: {
          id: container.id
        }
      }
    };
  }

  handleShuffleClicked() {
    this.toggleShuffleMode();
  }

  created() {
    window.addEventListener('keydown', this.handleKeyDown);
    const musicKitInstance = MusicKit.getInstance();
    // set up musicKit
    musicKitInstance.addEventListener(
      MusicKit.Events.playbackProgressDidChange,
      this.onPlaybackProgressDidChange
    );

    musicKitInstance.addEventListener(
      MusicKit.Events.playbackStateDidChange,
      this.onPlaybackStateDidChange
    );

    musicKitInstance.addEventListener(
      MusicKit.Events.playbackTimeDidChange,
      this.onPlaybackTimeDidChange
    );
  }

  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown);

    const musicKitInstance = MusicKit.getInstance();
    musicKitInstance.removeEventListener(
      MusicKit.Events.playbackProgressDidChange,
      this.onPlaybackProgressDidChange
    );

    musicKitInstance.addEventListener(
      MusicKit.Events.playbackStateDidChange,
      this.onPlaybackStateDidChange
    );

    musicKitInstance.removeEventListener(
      MusicKit.Events.playbackTimeDidChange,
      this.onPlaybackTimeDidChange
    );
  }

  handleKeyDown(event: KeyboardEvent) {
    const key = event.which || event.keyCode;
    if (key === 32) {
      // spacebar
      event.preventDefault();
      this.toggleCurrentTrack();
    } else if ((event.ctrlKey || event.metaKey) && key === 39) {
      event.preventDefault();
      // right arrow
      if (this.canGoNext) {
        this.playNext();
      }
    } else if ((event.ctrlKey || event.metaKey) && key === 37) {
      event.preventDefault();
      // left arrow
      if (this.canGoBack) {
        this.playPrevious();
      }
    } else if (
      // Ctrl/Cmd + Shift + Down
      key === 40 &&
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey
    ) {
      event.preventDefault();
      this.muteVolume();
    } else if (
      // Ctrl/Cmd + Shift + Up
      key === 38 &&
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey
    ) {
      event.preventDefault();
      // MAX volume
      this.changeVolume(1);
    } else if (key === 40 && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.$_turnDownVolume();
    } else if (key === 38 && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.$_turnUpVolume();
    }
  }

  onPlaybackProgressDidChange(event: any) {
    this.setPlaybackProgress(event.progress);
    // store.commit(SET_PLAYBACK_PROGESS, event.progress);
  }

  onPlaybackStateDidChange(event: any) {
    const DEFAULT_PAGE_TITLE = 'Maeve - An Apple Music web player';
    const musicKitInstace = MusicKit.getInstance();

    switch (musicKitInstace.player.playbackState) {
      case MusicKit.PlaybackStates.stopped:
        this.setIsPlaying(false);
        document.title = DEFAULT_PAGE_TITLE;
        break;
      case MusicKit.PlaybackStates.paused:
        this.setIsPlaying(false);
        document.title = DEFAULT_PAGE_TITLE;
        break;
      case MusicKit.PlaybackStates.playing: {
        this.setIsPlaying(true);
        this.setSongLoading(false);

        const { currentPlaying } = this.musicPlayer;

        if (currentPlaying) {
          document.title = `${currentPlaying.attributes.name} - ${
            currentPlaying.attributes.artistName
          }`;
        }
        break;
      }
      case MusicKit.PlaybackStates.loading:
        this.setSongLoading(true);
        break;
      case MusicKit.PlaybackStates.completed:
        document.title = DEFAULT_PAGE_TITLE;
    }
  }

  onPlaybackTimeDidChange = (event: any) => {
    this.setCurrentPlaybackTime(event.currentPlaybackTime);
  };

  $_turnDownVolume() {
    // Ctrl Down / Cmd Down
    if (this.volume === 0) {
      return;
    }
    let newVolume = this.volume - 0.1;
    if (newVolume < 0) {
      newVolume = 0;
    }

    this.changeVolume(newVolume);
    if (newVolume === 0) {
      this.setIsMuted();
    }
  }

  $_turnUpVolume() {
    // Ctrl Up / Cmd Up
    if (this.volume === 1) {
      return;
    }
    let newVolume = this.volume + 0.1;
    if (newVolume >= 1) {
      newVolume = 1;
    }

    this.changeVolume(newVolume);
  }
}
</script>

<style lang="scss" module>
@import '@/styles/components/_link-item.scss';
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
  flex-shrink: 0;
}

.song-name {
  font-weight: bold;
}

.song-name:hover {
  text-decoration: underline;
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
