function setupMusicKit() {
  if (!MusicKit) {
    document.addEventListener('musickitloaded', () => {
      configure();
    });
  } else {
    configure();
  }
}

function configure() {
  MusicKit.configure({
    developerToken: process.env.VUE_APP_DEVELOPER_TOKEN,
    app: {
      name: 'Maeve',
      version: '1.0',
      icon:
        'https://user-images.githubusercontent.com/14043840/50724470-4fe24300-10ee-11e9-92d2-1c8c88e8450a.png'
    }
  });
}

export default setupMusicKit;
