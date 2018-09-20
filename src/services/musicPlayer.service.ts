import musicKit from '@/services/musicKit';

const musicPlayerService = {
  get isPlaying(): boolean {
    return musicKit.getPlayerInstance().isPlaying;
  },

  get queuedSongs(): MusicKit.MediaItem[] {
    return musicKit.getPlayerInstance().queue.items;
  },

  play(): Promise<void> {
    // play() returns a promise
    return musicKit.getPlayerInstance().play();
  },

  pause(): void {
    // pause is a sync void function
    musicKit.getPlayerInstance().pause();
  },

  /**
   * Play next track from the queue
   */
  playNext(): Promise<MusicKit.MediaItem> {
    const musicKitPlayer = musicKit.getPlayerInstance();
    return musicKitPlayer
      .skipToNextItem()
      .then(() => musicKitPlayer.nowPlayingItem);
  },

  /**
   * Play previous track from the queue
   */
  playPrevious(): Promise<MusicKit.MediaItem> {
    const musicKitPlayer = musicKit.getPlayerInstance();
    return musicKitPlayer
      .skipToPreviousItem()
      .then(() => musicKitPlayer.nowPlayingItem);
  },

  /**
   * Play the collection (album/playlist) at the specified index
   * @param playParams Play parameters
   * @param index Index
   */
  playCollectionAtIndex(
    playParams: MusicKit.PlayParameters,
    index: number = 0
  ): Promise<MusicKit.MediaItem> {
    if (!playParams) {
      return Promise.reject('Playparams must be supplied to play');
    }

    const music = musicKit.getInstance();
    return music
      .setQueue({
        [playParams.kind]: playParams.id
      })
      .then(() => music.player.changeToMediaAtIndex(index))
      .then(() => music.player.nowPlayingItem);
  },

  /**
   * Append the items to the tail of the queue
   * @param items Items to be added
   */
  appendItemsToQueue(items: MusicKit.MediaItem[]): void {
    musicKit.getPlayerInstance().queue.append({ items });
  },

  /**
   * Add multiple items to the user's library
   * @param itemIds Ids of the items to be added
   * @param type Type of these items
   */
  addToLibrary(itemIds: string[], type: string) {
    return musicKit.getApiInstance().addToLibrary({
      [type]: itemIds
    });
  }
};

export default musicPlayerService;
