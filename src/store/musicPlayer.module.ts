import { GetterTree, MutationTree, ActionTree } from 'vuex';

import musicPlayerService from '@/services/musicPlayer.service';
import {
  PAUSE_CURRENT_TRACK,
  PLAY_NEXT,
  PLAY_PREVIOUS,
  PLAY_SONGS,
  RESUME_CURRENT_TRACK,
  TOGGLE_CURRENT_TRACK,
  PLAY_COLLECTION_WITH_SONG,
  SKIP_TO_SONG_AT_INDEX,
  TOGGLE_SHUFFLE_MODE,
  SEEK_TO_TIME,
  CHANGE_VOLUME,
  UPDATE_REPEAT_MODE
} from '@/store/actions.type';
import {
  SET_CURRENTLY_PLAYING_SONG,
  SET_IS_PLAYING,
  SET_PLAYBACK_PROGESS,
  SET_SONG_QUEUE,
  SET_SONG_LOADING,
  SET_CURRENT_PLAYBACK_TIME,
  SET_REPEAT_MODE,
  SET_VOLUME,
  SET_CURRENT_PLAYBACK_TIME_AFTER_SKIP
} from '@/store/mutations.type';
import {
  MusicPlayerState,
  PlayCollectionWithSongPayload,
  SkipToSongAtIndexPayload,
  PlaySongsPayload
} from './types';
import { RepeatMode } from '@/utils/constants';
import { Nullable } from '@/@types/model/model';
import { getArtworkUrl } from '@/utils/utils';

const initialState: MusicPlayerState = {
  currentPlaying: null,
  isPlaying: false,
  playbackProgress: 0,
  isLoading: false,
  currentPlaybackTimeInMilliSeconds: 0,
  repeatMode: RepeatMode.Off,
  volume: 1,
  currentPlaybackTimeAfterSkip: 0
};

const getters: GetterTree<MusicPlayerState, any> = {
  currentTrackArtwork({ currentPlaying }, getters): Nullable<string> {
    if (!currentPlaying) {
      return null;
    }

    if (getters.isAuthenticated) {
      return currentPlaying.artwork.url.replace('2000x2000bb', '300x300bb');
    }
    return getArtworkUrl(currentPlaying.artwork.url, 300, 300);
  },

  isCollectionBeingPlayed({ currentPlaying }) {
    return (collectionId: string) => {
      return (
        currentPlaying &&
        currentPlaying.container &&
        currentPlaying.container.id === collectionId
      );
    };
  },

  isSongBeingPlayed({ currentPlaying }) {
    return (songId: string) => {
      return currentPlaying && currentPlaying.id === songId;
    };
  },

  currentPlayingDuration({ currentPlaying }, getters) {
    if (!currentPlaying) {
      return 0;
    }
    return getters.isAuthenticated ? currentPlaying!.playbackDuration : 30000; // 30 seconds
  }
};

const actions: ActionTree<MusicPlayerState, any> = {
  [PLAY_NEXT]() {
    musicPlayerService.playNext();
  },

  [PLAY_PREVIOUS]() {
    musicPlayerService.playPrevious();
  },

  [TOGGLE_SHUFFLE_MODE]() {
    musicPlayerService.toggleShuffleMode();
  },

  [TOGGLE_CURRENT_TRACK]({ dispatch }) {
    if (musicPlayerService.isPlaying) {
      dispatch(PAUSE_CURRENT_TRACK);
    } else {
      dispatch(RESUME_CURRENT_TRACK);
    }
  },

  [PAUSE_CURRENT_TRACK]() {
    musicPlayerService.pause();
  },

  [RESUME_CURRENT_TRACK]() {
    return musicPlayerService.play().catch(err => {
      console.log(err);
    });
  },

  [PLAY_COLLECTION_WITH_SONG](
    { getters, dispatch, commit },
    { collection, songId, shuffle = false }: PlayCollectionWithSongPayload
  ) {
    if (
      !collection ||
      !collection.attributes ||
      !collection.attributes.playParams
    ) {
      return;
    }

    if (!songId && getters.isCollectionBeingPlayed(collection.id) && !shuffle) {
      dispatch(TOGGLE_CURRENT_TRACK);
      return;
    }

    if (songId && getters.isSongBeingPlayed(songId)) {
      dispatch(TOGGLE_CURRENT_TRACK);
      return;
    }

    return musicPlayerService
      .playCollectionWithSong(collection.attributes.playParams, shuffle, songId)
      .then(() => {
        commit(SET_SONG_QUEUE, musicPlayerService.queuedSongs);
      });
  },

  [PLAY_SONGS]({ commit }, { songIds, startSongIndex }: PlaySongsPayload) {
    musicPlayerService.playSongs(songIds, startSongIndex).then(() => {
      commit(SET_SONG_QUEUE, musicPlayerService.queuedSongs);
    });
  },

  [SKIP_TO_SONG_AT_INDEX](_, { index }: SkipToSongAtIndexPayload) {
    return musicPlayerService.skipToSongAtIndex(index);
  },

  [UPDATE_REPEAT_MODE]({ state, commit }) {
    const currentRepeatMode = state.repeatMode;

    const nextRepeatMode = (currentRepeatMode + 1) % 3;

    musicPlayerService.changeRepeatMode(nextRepeatMode);

    commit(SET_REPEAT_MODE, nextRepeatMode);
  },

  [SEEK_TO_TIME]({ commit }, time) {
    musicPlayerService.seekToTime(time);
    commit(SET_CURRENT_PLAYBACK_TIME_AFTER_SKIP, time);
  },

  [CHANGE_VOLUME]({ commit }, volume) {
    musicPlayerService.changeVolume(volume);
    commit(SET_VOLUME, volume);
  }
};

const mutations: MutationTree<MusicPlayerState> = {
  [SET_CURRENTLY_PLAYING_SONG](state, track: MusicKit.MediaItem) {
    state.currentPlaying = track;
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

  [SET_VOLUME](state, volume: number) {
    state.volume = volume;
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
