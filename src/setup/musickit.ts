import { Store } from 'vuex';

import {
  SET_PLAYBACK_PROGESS,
  SET_IS_PLAYING,
  SET_CURRENTLY_PLAYING_SONG,
  SET_SONG_LOADING
} from '@/store/mutations.type';
import { CHANGE_ROUTE } from '@/store/actions.type';

export function connectMusicKitToStore(
  musicKitInstance: MusicKit.MusicKitInstance,
  store: Store<any>
) {
  unregisterEventsFromMusicKit(musicKitInstance);

  musicKitInstance.addEventListener(
    MusicKit.Events.playbackProgressDidChange,
    event => {
      store.commit(SET_PLAYBACK_PROGESS, event.progress);
    }
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
        console.log('Loading state', event);
    }
  }

  musicKitInstance.removeEventListener(
    MusicKit.Events.playbackStateDidChange,
    onPlaybackStateDidChange
  );

  musicKitInstance.addEventListener(
    MusicKit.Events.playbackStateDidChange,
    onPlaybackStateDidChange
  );

  musicKitInstance.addEventListener(
    MusicKit.Events.authorizationStatusDidChange,
    ({ authorizationStatus }) => {
      if (authorizationStatus === 3) {
        // window.location.href = '/';
      }
      MusicKit.getInstance().player.stop();
      store.dispatch(CHANGE_ROUTE, 'home');
    }
  );

  musicKitInstance.addEventListener(
    MusicKit.Events.mediaItemDidChange,
    ({ item }) => {
      store.commit(SET_CURRENTLY_PLAYING_SONG, item);
    }
  );
}

export function unregisterEventsFromMusicKit(
  musicKitInstance: MusicKit.MusicKitInstance
) {
  musicKitInstance.removeEventListener(
    MusicKit.Events.playbackProgressDidChange
  );

  musicKitInstance.removeEventListener(MusicKit.Events.playbackStateDidChange);
}
