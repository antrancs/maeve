import { Store } from 'vuex';

import { SET_PLAYBACK_PROGESS } from '@/store/mutations.type';

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
}

export function unregisterEventsFromMusicKit(
  musicKitInstance: MusicKit.MusicKitInstance
) {
  musicKitInstance.removeEventListener(
    MusicKit.Events.playbackProgressDidChange
  );
}
