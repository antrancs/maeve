import { GetterTree, MutationTree, ActionTree } from 'vuex';

import musicPlayerService from '@/services/musicPlayer.service';
import { getArtworkUrl } from '@/utils/utils';
import {
  PAUSE_CURRENT_TRACK,
  PLAY_NEXT,
  PLAY_PREVIOUS,
  PLAY_SONGS,
  RESUME_CURRENT_TRACK,
  TOGGLE_CURRENT_TRACK,
  ADD_TO_LIBRARY,
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
  SET_VOLUME
} from '@/store/mutations.type';
import {
  MusicPlayerState,
  AddToLibraryPayload,
  PlayCollectionWithSongPayload,
  SkipToSongAtIndexPayload,
  PlaySongsPayload
} from './types';
import { RepeatMode } from '@/utils/constants';

const initialState: MusicPlayerState = {
  currentPlaying: null,
  isPlaying: false,
  playbackProgress: 0,
  isLoading: false,
  currentPlaybackTimeInMilliSeconds: 0,
  repeatMode: RepeatMode.Off,
  volume: 1
};

const getters: GetterTree<MusicPlayerState, any> = {
  currentTrackArtwork(state): string {
    return state.currentPlaying
      ? getArtworkUrl(state.currentPlaying.artwork.url, 300, 300)
      : '';
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

  [ADD_TO_LIBRARY](_, { itemIds, type }: AddToLibraryPayload) {
    return musicPlayerService.addToLibrary(itemIds, type);
  },

  [PLAY_COLLECTION_WITH_SONG](
    { getters, dispatch, commit },
    { collection, songId }: PlayCollectionWithSongPayload
  ) {
    if (
      !collection ||
      !collection.attributes ||
      !collection.attributes.playParams
    ) {
      return;
    }

    if (!songId && getters.isCollectionBeingPlayed(collection.id)) {
      dispatch(TOGGLE_CURRENT_TRACK);
      return;
    }

    if (songId && getters.isSongBeingPlayed(songId)) {
      dispatch(TOGGLE_CURRENT_TRACK);
      return;
    }

    return musicPlayerService
      .playCollectionWithSong(collection.attributes.playParams, songId)
      .then(() => {
        commit(SET_SONG_QUEUE, musicPlayerService.queuedSongs);
      });
  },

  [PLAY_SONGS]({ commit }, { songIds }: PlaySongsPayload) {
    musicPlayerService.playSongs(songIds).then(() => {
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

  [SEEK_TO_TIME](context, time) {
    musicPlayerService.seekToTime(time);
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
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
