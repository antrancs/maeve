const musicKit = {
  init() {
    if (window.MusicKit) {
      try {
        window.MusicKit.getInstance();
      } catch (error) {
        // MusicKit.getInstance() throws an exception when the instance is not available
        // in this case, we'll call configure() to configure the instance
        this.configure();
      }
    } else {
      document.addEventListener('musickitloaded', () => {
        console.log('musickitloaded');
        this.configure();
      });
    }
  },

  configure() {
    window.MusicKit.configure({
      developerToken: process.env.VUE_APP_DEVELOPER_TOKEN,
      app: {
        name: 'Maeve',
        build: '0.1'
      }
    });
    this.instance = window.MusicKit.getInstance();
  },

  getApiInstance() {
    return this.instance.api;
  }
};

export default musicKit;
