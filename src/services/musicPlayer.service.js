import musicKit from './musicKit';

const MusicPlayerService = {
  get isPlaying() {
    return musicKit.getPlayerInstance().isPlaying;
  },

  play() {
    // play() returns a promise
    return musicKit.getPlayerInstance().play();
  },

  pause() {
    // pause is a sync void function
    musicKit.getPlayerInstance().pause();
  },

  playSong(songId, playBackCallback) {
    const music = musicKit.getInstance();
    music.removeEventListener('playbackProgressDidChange');
    music.addEventListener('playbackProgressDidChange', playBackCallback);

    let playedSong = {};
    return music
      .setQueue({
        song: songId
      })
      .then(queue => {
        if (queue.items.length === 0) {
          return Promise.resolve();
        }

        [playedSong] = queue.items;
        return this.play();
      })
      .then(() => playedSong);
  },

  playCollection() {}
};

export default MusicPlayerService;
