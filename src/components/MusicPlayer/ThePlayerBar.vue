<template>
  <v-container
    v-if="musicPlayer.currentPlaying"
    :class="[
      'mb-2 py-0 px-0',
      $style['wrapper'],
      {
        [$style['minimized']]: musicPlayer.minimized
      }
    ]"
    :style="cssProps"
    @click.stop="showPlayerFullScreen"
  >
    <div
      v-if="musicPlayer.minimized"
      :class="$style['minimized-player']"
      :style="minimizedPlayerStyle"
    >
      <v-progress-circular
        :rotate="-90"
        :size="circularProgressSize"
        :width="circularProgressWidth"
        :value="musicPlayer.playbackProgress * 100"
        color="accent"
      >
      </v-progress-circular>
      <v-btn
        title="Maximize"
        icon
        @click.stop="toggleMinimized"
        :class="['mb-0 mr-0', $style['maximize-button']]"
      >
        <v-icon medium :style="primaryStyle">compare_arrows</v-icon>
      </v-btn>
    </div>

    <div :class="['secondary', $style['player-bar']]">
      <div :class="[$style['song-artwork']]" :style="songArtworkStyle"></div>
      <PlayerProgressBar
        :class="$style['progress-bar']"
        v-if="!musicPlayer.minimized"
      />
      <v-layout
        :class="$style['player-bar-content']"
        row
        fill-height
        align-center
        class="mx-2"
      >
        <v-flex
          xs8
          sm8
          md3
          :class="{ 'pr-2': $vuetify.breakpoint.xsOnly }"
          :style="primaryStyle"
        >
          <v-layout row wrap>
            <v-flex md12 :class="[$style['song-name'], 'long-text-truncated']">
              <span
                :class="$style['link-item']"
                :title="songName"
                @click.stop="() => goToAlbumPage(musicPlayer.currentPlaying)"
              >
                {{ songName }}
              </span>
            </v-flex>

            <v-flex
              md12
              :class="['long-text-truncated', $style['artist-name']]"
            >
              <span
                :class="$style['link-item']"
                :title="artistName"
                @click.stop="() => goToArtistPage(musicPlayer.currentPlaying)"
              >
                {{ artistName }}</span
              >
            </v-flex>
          </v-layout>

          <div
            v-if="songContainerPath"
            class="long-text-truncated"
            style="cursor: default"
          >
            <small style="cursor: default">From</small>
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
              [$style['btn-groups-small-device']]: $vuetify.breakpoint.xsOnly
            }"
          >
            <v-btn
              v-if="$vuetify.breakpoint.mdAndUp"
              icon
              @click.stop="handleShuffleClicked"
              title="Shuffle"
            >
              <v-icon medium :style="primaryStyle" :color="shuffleIconColor"
                >shuffle</v-icon
              >
            </v-btn>
            <PlayPreviousButton v-if="$vuetify.breakpoint.mdAndUp" />
            <PlayButton :size="$vuetify.breakpoint.mdAndUp ? 50 : 40" />
            <PlayNextButton v-if="$vuetify.breakpoint.mdAndUp" />
            <v-btn v-else title="Minimize" icon @click.stop="toggleMinimized">
              <v-icon medium :style="primaryStyle">compare_arrows</v-icon>
            </v-btn>

            <v-btn
              v-if="$vuetify.breakpoint.mdAndUp"
              icon
              @click.stop="updateRepeatMode"
              title="Repeat"
            >
              <v-icon medium :color="repeatIconColor" :style="primaryStyle">{{
                repeatIcon
              }}</v-icon>
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

            <PlayerVolume :width="110" v-if="$vuetify.breakpoint.lgAndUp" />

            <v-btn
              title="Show play queue"
              icon
              @click.stop="toggleQueueVisibility"
            >
              <v-icon medium :style="primaryStyle">playlist_play</v-icon>
            </v-btn>

            <v-btn title="Minimize" icon @click.stop="toggleMinimized">
              <v-icon medium :style="primaryStyle">compare_arrows</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { State, Action, Getter, Mutation } from 'vuex-class';

import PlayerProgressBar from './PlayerProgressBar.vue';
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
  MUTE_VOLUME,
  TOGGLE_MINIMIZED,
  CHECK_IF_SONG_PLAY_SUCCESSFUL
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
    LyricsDialog: () => import('@/components/LyricsDialog.vue'),
    PlayerProgressBar,
    PlayNextButton,
    PlayPreviousButton,
    PlayButton,
    PlayerVolume
  }
})
export default class PlayerBar extends Mixins(
  PlayerBarColorMixin,
  GoToArtistPageMixin,
  GoToAlbumPageMixin
) {
  private playerFullScreenVisible = false;
  private circularProgressWidth = 3;

  @State musicPlayer!: MusicPlayerState;

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
  @Action [TOGGLE_MINIMIZED]: () => void;
  @Action [CHECK_IF_SONG_PLAY_SUCCESSFUL]: () => void;

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

    const size = this.$vuetify.breakpoint.mdAndUp ? 90 : 70;

    if (this.isAuthenticated) {
      return this.musicPlayer.currentPlaying.attributes.artwork.url.replace(
        '2000x2000bb',
        `${size}x${size}bb`
      );
    }

    return getArtworkUrl(
      this.musicPlayer.currentPlaying.attributes.artwork,
      size,
      size
    );
  }

  get songArtworkStyle() {
    return {
      background: `url('${this.currentTrackArtwork}')`
    };
  }

  get cssProps() {
    return {
      '--player-bar-height': `${this.playerBarHeight}px`,
      '--minimized-player-scale-factor': this.minimizedPlayerScaleFactor
    };
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

  get minimizedPlayerScaleFactor() {
    return this.$vuetify.breakpoint.mdAndUp ? 0.7 : 1;
  }

  get playerBarHeight() {
    return this.$vuetify.breakpoint.mdAndUp ? 86 : 66;
  }

  get minimizedPlayerStyle() {
    const offset = (this.playerBarHeight - this.circularProgressSize) / 2;
    return {
      top: `${offset}px`,
      right: `${offset}px`
    };
  }

  get circularProgressSize() {
    return (
      this.playerBarHeight * this.minimizedPlayerScaleFactor +
      this.circularProgressWidth
    );
  }

  handleShuffleClicked() {
    this.toggleShuffleMode();
  }

  created() {
    window.addEventListener('keydown', this.handleKeyDown);

    if('mediaSession' in navigator) {
      //Add MediaKey Support using MediaSession
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        if (this.canGoNext) {
          this.playNext();
        }
      })

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        if (this.canGoBack) {
          this.playPrevious();
        }
      })
    }

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

  async onPlaybackStateDidChange(event: any) {
    const DEFAULT_PAGE_TITLE = 'Maeve - An Apple Music web player';
    const musicKitInstance = MusicKit.getInstance();

    switch (musicKitInstance.player.playbackState) {
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
        this.setIsPlaying(false);
        this.setSongLoading(true);
        break;
      case MusicKit.PlaybackStates.completed:
        this.setIsPlaying(false);
        document.title = DEFAULT_PAGE_TITLE;
        break;

      case MusicKit.PlaybackStates.ended:
        this.setIsPlaying(false);
        this.checkIfSongPlaySuccessful();
    }
  }

  onPlaybackTimeDidChange = (event: any) => {
    this.setCurrentPlaybackTime(event.currentPlaybackTime);
  };

  showPlayerFullScreen() {
    this.$emit('show-player-fullscreen');
  }

  $_turnDownVolume() {
    // Ctrl Down / Cmd Down
    if (this.musicPlayer.volume === 0) {
      return;
    }
    let newVolume = this.musicPlayer.volume - 0.1;
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
    if (this.musicPlayer.volume === 1) {
      return;
    }
    let newVolume = this.musicPlayer.volume + 0.1;
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
  bottom: 0.8rem;
  cursor: pointer;
  position: sticky;
  z-index: 5;
  display: flex;
  justify-content: flex-end;
}

.player-bar {
  border-top: 0.1rem solid black;
  padding-left: var(--player-bar-height);
  padding-top: 0.3rem;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.8);
  border-radius: calc(var(--player-bar-height) / 2);
  height: var(--player-bar-height);
  position: relative;
  transition: width 0.4s ease-out, transform 0.4s ease-out;
  width: 100%;
}

.minimized {
  & .player-bar-content {
    display: none;
  }

  & .player-bar {
    width: var(--player-bar-height);
    padding-left: 0;
    padding-top: 0;
    transform: scale(var(--minimized-player-scale-factor));
  }
}

.song-artwork {
  // box-shadow: 0px 5px 20px 1px rgba(0, 0, 0, 0.8);
  border-radius: calc(var(--player-bar-height) / 2);
  height: var(--player-bar-height);
  width: var(--player-bar-height);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.minimized-player {
  position: absolute;
  z-index: 2;

  & .maximize-button {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -18px;
    margin-left: -18px;
  }
}

.minimized-player::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
}

.progress-bar {
  position: absolute;
  top: 0;
  left: calc(var(--player-bar-height) / 2);
  width: calc(100% - var(--player-bar-height));
}

.song-name {
  font-weight: bold;

  & > .link-item {
    color: var(--v-primaryText-base);
  }
}

.btn-groups-small-device button {
  margin: 0;
}

@media screen and (max-width: $md-breakpoint - 1) {
  .wrapper {
    --player-bar-height: 6.6rem;
  }

  .song-name,
  .artist-name {
    flex-grow: 0;
    max-width: 50%;
  }

  .artist-name {
    padding-left: 0.4rem;
  }

  .artist-name::before {
    content: '•';
    margin-right: 0.08rem;
  }
}
</style>

<style lang="scss">
.progress-bar-wrapper:not(.progress-bar-mouse-over) .v-slider__thumb {
  display: none;
}
</style>
