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
  playNext(): Promise<number> {
    const musicKitPlayer = musicKit.getPlayerInstance();
    return musicKitPlayer.skipToNextItem();
  },

  /**
   * Play previous track from the queue
   */
  playPrevious(): Promise<number> {
    const musicKitPlayer = musicKit.getPlayerInstance();
    return musicKitPlayer.skipToPreviousItem();
  },

  /**
   * Play a collection (album/playlist) at the specified index
   * @param playParams Play parameters of the collection
   * @param index Index of the song from collection to play
   */
  playCollectionAtIndex(
    playParams: MusicKit.PlayParameters,
    index: number = 0
  ): Promise<void> {
    if (!playParams) {
      return Promise.reject('Playparams must be supplied to play');
    }

    const music = musicKit.getInstance();
    return music
      .setQueue({
        [playParams.kind]: playParams.id
      })
      .then(() => music.player.changeToMediaAtIndex(index));
  },

  /**
   * Play a song from a collection (album/playlist)
   * @param playParams Play parameters of the collection
   * @param songId (optional) id of the song to play. If no id is provided, the first song will be played
   */
  playCollectionWithSong(
    playParams: MusicKit.PlayParameters,
    songId?: string
  ): Promise<number> {
    if (!playParams) {
      return Promise.reject('Playparams must be supplied to play');
    }

    const music = musicKit.getInstance();
    return music
      .setQueue({
        [playParams.kind]: playParams.id
      })
      .then(() => {
        if (songId) {
          return music.player.changeToMediaItem(songId);
        }
        return music.play();
      });
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
  },

  /**
   * Play multiple songs
   * @param songIds Id of those songs to play
   */
  playSongs(songIds: string[]) {
    const music = musicKit.getInstance();
    return music
      .setQueue({
        songs: songIds
      })
      .then(() => {
        return music.play();
      })
      .then(() => music.player.nowPlayingItem);
  },

  /**
   * Skip to a song at the specified index in the queue
   * @param index Index of the song
   */
  skipToSongAtIndex(index: number): Promise<void> {
    return musicKit.getPlayerInstance().changeToMediaAtIndex(index);
  }
};

export default musicPlayerService;
