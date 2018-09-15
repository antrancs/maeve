import { Store } from 'vuex';

import { SET_PLAYBACK_PROGESS } from '@/store/mutations.type';
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
}

export function unregisterEventsFromMusicKit(
  musicKitInstance: MusicKit.MusicKitInstance
) {
  musicKitInstance.removeEventListener(
    MusicKit.Events.playbackProgressDidChange
  );
}
