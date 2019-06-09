import { GetterTree, MutationTree, ActionTree } from 'vuex';

import {
  PAUSE_CURRENT_TRACK,
  PLAY_NEXT,
  PLAY_PREVIOUS,
  PLAY_SONGS,
  RESUME_CURRENT_TRACK,
  TOGGLE_CURRENT_TRACK,
  SKIP_TO_SONG_AT_INDEX,
  SEEK_TO_TIME,
  CHANGE_VOLUME,
  MUTE_VOLUME,
  UPDATE_REPEAT_MODE,
  TOGGLE_SHUFFLE_MODE,
  PLAY_COLLECTION
} from '@/store/actions.type';
import {
  SET_CURRENTLY_PLAYING_SONG,
  SET_IS_PLAYING,
  SET_PLAYBACK_PROGESS,
  SET_SONG_LOADING,
  SET_CURRENT_PLAYBACK_TIME,
  SET_REPEAT_MODE,
  SET_VOLUME,
  SET_IS_MUTED,
  SET_CURRENT_PLAYBACK_TIME_AFTER_SKIP,
  SET_SHUFFLE_MODE,
  SET_QUEUE
} from '@/store/mutations.type';
import {
  MusicPlayerState,
  SkipToSongAtIndexPayload,
  PlaySongsPayload,
  PlayCollectionPayload
} from './types';
import { RepeatMode } from '@/utils/constants';
import { ShuffleMode } from '@/@types/model/model';

const initialState: MusicPlayerState = {
  currentPlaying: null,
  isPlaying: false,
  playbackProgress: 0,
  isLoading: false,
  currentPlaybackTimeInMilliSeconds: 0,
  repeatMode: RepeatMode.Off,
  volume: 1,
  isMuted: false,
  currentPlaybackTimeAfterSkip: 0,
  shuffleMode: ShuffleMode.Off
};

const getters: GetterTree<MusicPlayerState, any> = {
  isSongBeingPlayed({ currentPlaying }) {
    return (songId: string) => {
      return currentPlaying && currentPlaying.id === songId;
    };
  },

  currentPlayingDuration({ currentPlaying }, getters) {
    if (!currentPlaying || !currentPlaying.attributes) {
      return 0;
    }

    return getters.isAuthenticated
      ? currentPlaying.attributes.durationInMillis
      : 30000; // 30 seconds
  }
};

const actions: ActionTree<MusicPlayerState, any> = {
  [PLAY_NEXT]() {
    return MusicKit.getInstance().player.skipToNextItem();
  },

  [PLAY_PREVIOUS]() {
    return MusicKit.getInstance().player.skipToPreviousItem();
  },

  [TOGGLE_CURRENT_TRACK]({ dispatch }) {
    if (MusicKit.getInstance().player.isPlaying) {
      dispatch(PAUSE_CURRENT_TRACK);
    } else {
      dispatch(RESUME_CURRENT_TRACK);
    }
  },

  [PAUSE_CURRENT_TRACK]() {
    return MusicKit.getInstance().player.pause();
  },

  [RESUME_CURRENT_TRACK]() {
    return MusicKit.getInstance()
      .player.play()
      .catch(err => {
        // console.log(err);
      });
  },

  async [PLAY_COLLECTION](
    { commit, dispatch },
    {
      collectionId,
      collectionType,
      startPosition,
      shuffle = false
    }: PlayCollectionPayload
  ) {
    const audioPlayer = document.getElementById('apple-music-player');

    if (audioPlayer) {
      (audioPlayer as HTMLAudioElement).load();
    }

    const type =
      collectionType === 'library-albums' || collectionType === 'albums'
        ? 'album'
        : 'playlist';

    dispatch('changeShuffleMode', shuffle);

    const musicKitInstance = MusicKit.getInstance();
    await musicKitInstance.setQueue({
      [type]: collectionId
    });

    if (startPosition) {
      await musicKitInstance.player.changeToMediaAtIndex(startPosition);
    }

    commit(SET_QUEUE, musicKitInstance.player.queue, { root: true });

    return musicKitInstance.player.play();
  },

  async [PLAY_SONGS](
    { commit, dispatch },
    { shuffle = false, songs, sourceInfo, startPosition }: PlaySongsPayload
  ) {
    const mediaItems = songs.map(
      song =>
        new MusicKit.MediaItem({
          id: song.id,
          attributes: song.attributes,
          type: 'song',
          container: {
            id: song.id,
            additionalInfo: {
              source: sourceInfo
            }
          }
        })
    );

    dispatch('changeShuffleMode', shuffle);
    const musicKitInstance = MusicKit.getInstance();

    await musicKitInstance.setQueue({
      items: mediaItems
    });

    if (startPosition) {
      await musicKitInstance.player.changeToMediaAtIndex(startPosition);
    }

    commit(SET_QUEUE, musicKitInstance.player.queue, { root: true });
    return musicKitInstance.player.play();
  },

  // [PLAY_CURRENT_SONG]({ state, dispatch }, song: PlayQueueSong) {
  //   const mediaItems = new MusicKit.MediaItem({
  //     id: song.id,
  //     attributes: song.attributes,
  //     type: 'song',
  //     container: {
  //       id: song.id
  //     }
  //   });

  //   const music = MusicKit.getInstance();

  //   return music
  //     .setQueue({
  //       items: [mediaItems]
  //     })
  //     .then(() => {
  //       if (music.player.playbackState === MusicKit.PlaybackStates.playing) {
  //         return music.player.pause();
  //       }
  //       return Promise.resolve();
  //     })
  //     .then(() => {
  //       return music.player.play();
  //     })
  //     .catch(err => err);
  // },

  [SKIP_TO_SONG_AT_INDEX](_, { index }: SkipToSongAtIndexPayload) {
    return MusicKit.getInstance().player.changeToMediaAtIndex(index);
  },

  [UPDATE_REPEAT_MODE]({ state, commit }) {
    const currentRepeatMode = state.repeatMode;
    let nextRepeatMode = (currentRepeatMode + 1) % 3;
    const musicKitPlayer = MusicKit.getInstance().player;

    // Repeat mode of MusicKit is 0: Off, 1: One, 2: All, so we need to switch up
    if (nextRepeatMode === RepeatMode.All) {
      musicKitPlayer.repeatMode = RepeatMode.One as number;
    } else if (nextRepeatMode === RepeatMode.One) {
      musicKitPlayer.repeatMode = RepeatMode.All as number;
    }

    commit(SET_REPEAT_MODE, nextRepeatMode);
  },

  // toggleShuffleMode sets the mode to musicPlayer's state
  // while toggleShuffle shuffles/unshuffles the mainSongs in playQueue module
  [TOGGLE_SHUFFLE_MODE]({ state, commit, dispatch }) {
    const newMode = +!state.shuffleMode;
    MusicKit.getInstance().player.shuffleMode = newMode;
    commit(SET_SHUFFLE_MODE, newMode);
  },

  changeShuffleMode({ commit }, shuffle: boolean) {
    const musicKitPlayer = MusicKit.getInstance().player;
    musicKitPlayer.shuffleMode = shuffle ? 1 : 0;
    commit(SET_SHUFFLE_MODE, musicKitPlayer.shuffleMode);
  },

  async [SEEK_TO_TIME]({ commit }, time) {
    await MusicKit.getInstance().player.seekToTime(time);
    commit(SET_CURRENT_PLAYBACK_TIME_AFTER_SKIP, time);
  },

  [CHANGE_VOLUME]({ commit, state }, volume) {
    if (volume < 0 || volume > 1) {
      return;
    }

    MusicKit.getInstance().player.volume = volume;

    commit(SET_VOLUME, volume);
    if (state.isMuted) {
      commit(SET_IS_MUTED);
    }
  },

  [MUTE_VOLUME]({ state, commit }) {
    const volume = state.isMuted ? state.volume : 0;
    MusicKit.getInstance().player.volume = volume;

    commit(SET_IS_MUTED);
  }
};

const mutations: MutationTree<MusicPlayerState> = {
  [SET_CURRENTLY_PLAYING_SONG](state, song: MusicKit.MediaItem | null) {
    state.currentPlaying = song;
  },

  [SET_IS_PLAYING](state, isPlaying: boolean) {
    state.isPlaying = isPlaying;
  },

  [SET_SONG_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading;
  },

  [SET_PLAYBACK_PROGESS](state, playbackProgress: number) {
    state.playbackProgress = playbackProgress;
  },

  [SET_CURRENT_PLAYBACK_TIME](state, currentPlaybackTime: number) {
    state.currentPlaybackTimeInMilliSeconds = currentPlaybackTime * 1000;
  },

  [SET_REPEAT_MODE](state, repeatMode: number) {
    state.repeatMode = repeatMode;
  },

  [SET_SHUFFLE_MODE](state, value: number) {
    state.shuffleMode = value;
  },

  [SET_VOLUME](state, volume: number) {
    state.volume = volume;
  },

  [SET_IS_MUTED](state) {
    state.isMuted = !state.isMuted;
  },

  [SET_CURRENT_PLAYBACK_TIME_AFTER_SKIP](state, time: number) {
    state.currentPlaybackTimeAfterSkip = time;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
