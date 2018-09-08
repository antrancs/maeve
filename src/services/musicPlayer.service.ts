import musicKit from '@/services/musicKit';

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

  playNext(): Promise<MusicKit.MediaItem> {
    const musicKitPlayer = musicKit.getPlayerInstance();
    return musicKitPlayer
      .skipToNextItem()
      .then(() => musicKitPlayer.nowPlayingItem);
  },

  playPrevious(): Promise<MusicKit.MediaItem> {
    const musicKitPlayer = musicKit.getPlayerInstance();
    return musicKitPlayer
      .skipToPreviousItem()
      .then(() => musicKitPlayer.nowPlayingItem);
  },

  playCollectionAtIndex(
    collectionId: string,
    collectionType: MusicKit.Kind,
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
