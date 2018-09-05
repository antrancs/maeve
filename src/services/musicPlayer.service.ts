import musicKit from '@/services/musicKit';
// import SongQueue from '@/utils/SongQueue';
// import musicApiService, { CollectionType } from '@/services/musicApi.service';

const musicPlayerService = {
  get isPlaying(): boolean {
    return musicKit.getPlayerInstance().isPlaying;
  },

  play(): Promise<void> {
    // play() returns a promise
    return musicKit.getPlayerInstance().play();
  },

  pause(): void {
    // pause is a sync void function
    musicKit.getPlayerInstance().pause();
  },

  playSong(
    song: MusicKit.MediaItem,
    collectionId: string
  ): Promise<MusicKit.MediaItem> {
    const music = musicKit.getInstance();

    return music
      .setQueue({
        album: collectionId
      })
      .then(queue => {
        if (queue.items.length === 0) {
          return Promise.resolve();
        }

        return this.play();
      })
      .then(() => music.player.nowPlayingItem);
  },

  playNext(): Promise<number> {
    return musicKit.getPlayerInstance().skipToNextItem();
  },

  playPrevious(): Promise<number> {
    return musicKit.getPlayerInstance().skipToPreviousItem();
  },

  playCollectionAtIndex(
    collectionId: string,
    collectionType: string,
    index: number
  ): Promise<MusicKit.MediaItem> {
    const music = musicKit.getInstance();

    return music
      .setQueue({
        [collectionType]: collectionId
      })
      .then(() => music.player.changeToMediaAtIndex(index))
      .then(() => music.player.play())
      .then(() => music.player.nowPlayingItem);
  }
};

export default musicPlayerService;
