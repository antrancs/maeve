import musicKit from './musicKit';
import SongQueue from './../utils/SongQueue';
import musicApiService from './musicApi.service';

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

    return music
      .setQueue({
        song: songId
      })
      .then(queue => {
        if (queue.items.length === 0) {
          return Promise.resolve();
        }

        const [firstItem] = queue.items;
        this.currentlyPlayingSong = firstItem;

        return this.play();
      });
  },

  playSongFromCollection(
    songId,
    collectionType,
    collectionId,
    playBackCallback
  ) {
    return musicApiService
      .getCollection(collectionId, collectionType)
      .then(({ tracks }) => {
        if (tracks.length === 0) {
          return Promise.resolve();
        }

        this.playbackQueue = new SongQueue(tracks);
        return this.playSong(songId || tracks[0].id, playBackCallback);
      });
  },

  playNext(playBackCallback) {
    const nextSong = this.playbackQueue.getNext(this.currentlyPlayingSong.id);
    if (!nextSong) {
      return Promise.reject();
    }
    return this.playSong(nextSong.id, playBackCallback);
  },

  playPrevious() {}
};

export default MusicPlayerService;
