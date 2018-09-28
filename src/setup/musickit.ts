import { Store } from 'vuex';

import {
  SET_PLAYBACK_PROGESS,
  SET_IS_PLAYING,
  SET_CURRENTLY_PLAYING_SONG,
  SET_SONG_LOADING,
  SET_CURRENT_PLAYBACK_TIME
} from '@/store/mutations.type';
import { CHANGE_ROUTE } from '@/store/actions.type';

export function connectMusicKitToStore(
  musicKitInstance: MusicKit.MusicKitInstance,
  store: Store<any>
) {
  function onPlaybackProgressDidChange(event: any) {
    store.commit(SET_PLAYBACK_PROGESS, event.progress);
  }
  musicKitInstance.addEventListener(
    MusicKit.Events.playbackProgressDidChange,
    onPlaybackProgressDidChange
  );

  function onPlaybackStateDidChange(event: any) {
    switch (musicKitInstance.player.playbackState) {
      case MusicKit.PlaybackStates.stopped:
      case MusicKit.PlaybackStates.paused:
        store.commit(SET_IS_PLAYING, false);
        break;
      case MusicKit.PlaybackStates.playing:
        store.commit(SET_IS_PLAYING, true);
        store.commit(SET_SONG_LOADING, false);
        break;
      case MusicKit.PlaybackStates.loading:
        store.commit(SET_SONG_LOADING, true);
    }
  }
  musicKitInstance.addEventListener(
    MusicKit.Events.playbackStateDidChange,
    onPlaybackStateDidChange
  );

  function onAuthorizationStatusDidChange({ authorizationStatus }: any) {
    MusicKit.getInstance().player.stop();
    store.dispatch(CHANGE_ROUTE, 'home');
  }
  musicKitInstance.addEventListener(
    MusicKit.Events.authorizationStatusDidChange,
    onAuthorizationStatusDidChange
  );

  function onMediaItemDidChange({ item }: any) {
    store.commit(SET_CURRENTLY_PLAYING_SONG, item);
  }
  musicKitInstance.addEventListener(
    MusicKit.Events.mediaItemDidChange,
    onMediaItemDidChange
  );

  function onPlaybackTimeDidChange(event: any) {
    store.commit(SET_CURRENT_PLAYBACK_TIME, event.currentPlaybackTime);
  }
  musicKitInstance.addEventListener(
    MusicKit.Events.playbackTimeDidChange,
    onPlaybackTimeDidChange
  );

  window.onunload = () => {
    musicKitInstance.removeEventListener(
      MusicKit.Events.playbackProgressDidChange,
      onPlaybackProgressDidChange
    );
    musicKitInstance.removeEventListener(
      MusicKit.Events.playbackStateDidChange,
      onPlaybackStateDidChange
    );
    musicKitInstance.removeEventListener(
      MusicKit.Events.authorizationStatusDidChange,
      onAuthorizationStatusDidChange
    );
    musicKitInstance.removeEventListener(
      MusicKit.Events.mediaItemDidChange,
      onMediaItemDidChange
    );
    musicKitInstance.removeEventListener(
      MusicKit.Events.playbackTimeDidChange,
      onPlaybackTimeDidChange
    );
  };
}
