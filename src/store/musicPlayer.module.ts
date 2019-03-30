import { GetterTree, MutationTree, ActionTree } from 'vuex';

import musicPlayerService from '@/services/musicPlayer.service';

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
  PLAY_CURRENT_SONG,
  MOVE_NEXT_PLAY_QUEUE,
  MOVE_BACK_PLAY_QUEUE,
  TOGGLE_SHUFFLE_MODE,
  TOGGLE_SHUFFLE,
  SHUFFLE_MAIN_SONGS,
  PLAY_CURRENT
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
  SET_MAIN_SONGS,
  SET_CURRENT_COLLECTION_ID,
  SET_CURRENTLY_PLAYING_SOURCE,
  SET_MAIN_SONGS_SOURCE,
  SET_MAIN_SONGS_INDEX,
  SET_SHUFFLE_MODE,
  SET_YOUR_QUEUE,
  SET_SHUFFLED_SONGS_INDEX,
  SET_NEXT_SONG_TO_PLAY,
  SET_CURRENT_COLLECTION_TYPE
} from '@/store/mutations.type';
import {
  MusicPlayerState,
  SkipToSongAtIndexPayload,
  PlaySongsPayload,
  PlayNextPayload
} from './types';
import { RepeatMode } from '@/utils/constants';
import { PlayQueueSong, Artist, ShuffleMode } from '@/@types/model/model';

const initialState: MusicPlayerState = {
  currentPlaying: null,
  currentPlayingSource: '',
  currentCollectionId: null,
  currentCollectionType: null,
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
  },

  isYourQueuePlaying({ currentPlayingSource }) {
    return currentPlayingSource === 'Your Queue';
  }
};

const actions: ActionTree<MusicPlayerState, any> = {
  async [PLAY_NEXT]({ dispatch }, { forceSkip = false }: PlayNextPayload) {
    await dispatch(MOVE_NEXT_PLAY_QUEUE, { forceSkip });
    await dispatch(PLAY_CURRENT);
  },

  [PLAY_CURRENT]({ rootState, commit, dispatch }) {
    const songToPlay = rootState.playQueue.nextSongToPlay;

    if (songToPlay) {
      commit(SET_CURRENTLY_PLAYING_SONG, songToPlay.song);
      commit(SET_CURRENTLY_PLAYING_SOURCE, songToPlay.source);
      if (songToPlay.song) {
        return dispatch(PLAY_CURRENT_SONG, songToPlay.song);
      }
    }
  },

  async [PLAY_PREVIOUS]({ rootState, dispatch, commit }) {
    dispatch(MOVE_BACK_PLAY_QUEUE);
    const songToPlay = rootState.playQueue.nextSongToPlay;

    if (songToPlay.song) {
      commit(SET_CURRENTLY_PLAYING_SONG, songToPlay.song);
      commit(SET_CURRENTLY_PLAYING_SOURCE, songToPlay.source);
      await dispatch(PLAY_CURRENT_SONG, songToPlay.song);
    }
  },

  [TOGGLE_CURRENT_TRACK]({ dispatch }) {
    if (musicPlayerService.isPlaying) {
      dispatch(PAUSE_CURRENT_TRACK);
    } else {
      dispatch(RESUME_CURRENT_TRACK);
    }
  },

  [PAUSE_CURRENT_TRACK]() {
    return musicPlayerService.pause();
  },

  [RESUME_CURRENT_TRACK]() {
    return musicPlayerService.play().catch(err => {
      // console.log(err);
    });
  },

  [PLAY_SONGS](
    { dispatch, commit, rootState, rootGetters },
    {
      collectionId,
      startSongIndex = 0,
      shuffle = false,
      songs,
      songsSourceName,
      collectionType
    }: PlaySongsPayload
  ) {
    // filter out blocked songs & songs from blocked artists
    const songsToPlay = songs
      .filter(song => {
        let artists: Artist[] = [];
        if (song.relationships && song.relationships.artists) {
          artists = song.relationships.artists.data;
          for (const artist of artists) {
            if (rootState.settings.blockedArtists[artist.id]) {
              return false;
            }
          }
        }
        return true;
      })
      .filter(song => !rootState.settings.blockedSongs[song.id])
      .filter(song => song.attributes); // song without attributes are not playable

    const playQueueSongs: PlayQueueSong[] = songsToPlay.map((song, index) => ({
      qId: `${song.id}-${index}`,
      ...song
    }));

    commit(SET_MAIN_SONGS, playQueueSongs);
    commit(SET_MAIN_SONGS_SOURCE, songsSourceName);
    commit(SET_CURRENT_COLLECTION_ID, collectionId);
    commit(SET_CURRENT_COLLECTION_TYPE, collectionType);
    commit(SET_MAIN_SONGS_INDEX, startSongIndex);
    commit(SET_SHUFFLED_SONGS_INDEX, 0);
    commit(SET_SHUFFLE_MODE, +shuffle);

    if (+shuffle === ShuffleMode.On) {
      dispatch(SHUFFLE_MAIN_SONGS);
    }

    commit(SET_YOUR_QUEUE, []);

    const { currentSongs, currentSongIndex } = rootGetters;
    commit(SET_NEXT_SONG_TO_PLAY, {
      song: currentSongs[currentSongIndex],
      source: songsSourceName
    });
    dispatch(PLAY_CURRENT);
  },

  [PLAY_CURRENT_SONG]({ state, dispatch }, song: PlayQueueSong) {
    const mediaItems = new MusicKit.MediaItem({
      id: song.id,
      attributes: song.attributes,
      type: 'song',
      container: {
        id: song.id
      }
    });

    const music = MusicKit.getInstance();

    return music
      .setQueue({
        items: [mediaItems]
      })
      .then(() => {
        if (music.player.playbackState === MusicKit.PlaybackStates.playing) {
          return music.player.pause();
        }
        return Promise.resolve();
      })
      .then(() => {
        return music.player.play();
      })
      .catch(err => err);
  },

  [SKIP_TO_SONG_AT_INDEX](_, { index }: SkipToSongAtIndexPayload) {
    return musicPlayerService.skipToSongAtIndex(index);
  },

  [UPDATE_REPEAT_MODE]({ state, commit }) {
    const currentRepeatMode = state.repeatMode;
    const nextRepeatMode = (currentRepeatMode + 1) % 3;

    // if (nextRepeatMode === RepeatMode.One) {
    //   musicPlayerService.changeRepeatMode(nextRepeatMode);
    // }

    commit(SET_REPEAT_MODE, nextRepeatMode);
  },

  // toggleShuffleMode sets the mode to musicPlayer's state
  // while toggleShuffle shuffles/unshuffles the mainSongs in playQueue module
  [TOGGLE_SHUFFLE_MODE]({ state, commit, dispatch }) {
    const newMode = +!state.shuffleMode;
    commit(SET_SHUFFLE_MODE, newMode);
    dispatch(TOGGLE_SHUFFLE);
  },

  [SEEK_TO_TIME]({ commit }, time) {
    musicPlayerService.seekToTime(time);
    commit(SET_CURRENT_PLAYBACK_TIME_AFTER_SKIP, time);
  },

  [CHANGE_VOLUME]({ commit, state }, volume) {
    musicPlayerService.changeVolume(volume);
    commit(SET_VOLUME, volume);
    if (state.isMuted) {
      commit(SET_IS_MUTED);
    }
  },

  [MUTE_VOLUME]({ state, commit }) {
    const volume = state.isMuted ? state.volume : 0;
    musicPlayerService.changeVolume(volume);
    commit(SET_IS_MUTED);
  }
};

const mutations: MutationTree<MusicPlayerState> = {
  [SET_CURRENTLY_PLAYING_SONG](state, song: PlayQueueSong | null) {
    state.currentPlaying = song;
  },

  [SET_CURRENTLY_PLAYING_SOURCE](state, sourceName: string) {
    state.currentPlayingSource = sourceName;
  },

  [SET_CURRENT_COLLECTION_ID](state, id: string | null) {
    state.currentCollectionId = id;
  },

  [SET_CURRENT_COLLECTION_TYPE](state, type: 'albums' | 'playlists' | null) {
    state.currentCollectionType = type;
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
