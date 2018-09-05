import { Store } from 'vuex';

import { SET_PLAYBACK_PROGESS } from '@/store/mutations.type';

class MusicKitService {
  instance: MusicKit.MusicKitInstance | null = null;

  init() {
    if (MusicKit) {
      this.initInstance();
      // try {
      //   // window.MusicKit.getInstance();
      //   this.initInstance();
      // } catch (error) {
      //   console.log(error.message);
      //   // MusicKit.getInstance() throws an exception when the instance is not available
      //   // in this case, we'll call configure() to configure the instance
      //   this.configure();
      // }
    } else {
      document.addEventListener('musickitloaded', () => {
        console.log('musickitloaded');
        this.configure();
      });
    }
  }

  configure() {
    try {
      MusicKit.configure({
        developerToken: process.env.VUE_APP_DEVELOPER_TOKEN,
        app: {
          name: 'Maeve',
          build: '0.1'
        }
      });

      this.initInstance();
    } catch (error) {
      switch (error.message) {
        case 'Initialized with an expired token.':
          // call server to get a new token
          break;
        default:
          break;
      }
    }

    // this.instance = window.MusicKit.getInstance();
  }

  getInstance(): MusicKit.MusicKitInstance {
    if (!this.instance) {
      this.initInstance();
    }
    return this.instance!;
  }

  getApiInstance(): MusicKit.API {
    return this.getInstance().api;
  }

  getPlayerInstance(): MusicKit.Player {
    return this.getInstance().player;
  }

  initInstance() {
    try {
      this.instance = MusicKit.getInstance();
    } catch (error) {
      switch (error.message) {
        case 'No configured instance':
          this.configure();
          break;
        default:
          break;
      }
    }
  }
}

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

const musicKitService = new MusicKitService();
export default musicKitService;
