class MusicKitService {
  instance: MusicKit.MusicKitInstance | null = null;

  init() {
    if (MusicKit) {
      this.initInstance();
    } else {
      document.addEventListener('musickitloaded', () => {
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
          version: '1.0',
          icon:
            'https://user-images.githubusercontent.com/14043840/50724470-4fe24300-10ee-11e9-92d2-1c8c88e8450a.png'
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

const musicKitService = new MusicKitService();
export { musicKitService as default };
