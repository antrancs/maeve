const musicKit = {
  init() {
    if (window.MusicKit) {
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
  },

  configure() {
    try {
      window.MusicKit.configure({
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
  },

  getInstance() {
    return this.instance;
  },

  getApiInstance() {
    return this.instance.api;
  },

  getPlayerInstance() {
    return this.instance.player;
  },

  initInstance() {
    try {
      this.instance = window.MusicKit.getInstance();
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
};

export default musicKit;
