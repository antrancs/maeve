import musicKit from '@/services/musicKit';
import { Nullable } from '@/@types/model/model';
import { RepeatMode } from '@/utils/constants';

const musicPlayerService = {
  get isPlaying(): boolean {
    return musicKit.getPlayerInstance().isPlaying;
  },

  get queuedSongs(): MusicKit.MediaItem[] {
    return musicKit.getPlayerInstance().queue.items;
  },

  get nextSongInQueue(): Nullable<MusicKit.MediaItem> {
    return musicKit.getPlayerInstance().queue.nextPlayableItem;
  },

  play(): Promise<number> {
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

  toggleShuffleMode() {
    const prevMode = musicKit.getPlayerInstance().shuffleMode;
    if (prevMode === 0) {
      musicKit.getPlayerInstance().shuffleMode = 1;
    } else {
      musicKit.getPlayerInstance().shuffleMode = 0;
    }

    console.log(musicKit.getPlayerInstance().shuffleMode);
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

        return music.player.play();
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
   * Add items after the currently playing item
   * @param items Items to be added
   */
  prependItems(items: MusicKit.MediaItem[]): void {
    musicKit.getPlayerInstance().queue.prepend({ items });
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
  playSongs(songIds: string[]): Promise<number> {
    const music = musicKit.getInstance();
    return music
      .setQueue({
        songs: songIds
      })
      .then(() => {
        return music.player.play();
      });
  },

  /**
   * Skip to a song at the specified index in the queue
   * @param index Index of the song
   */
  skipToSongAtIndex(index: number): Promise<void> {
    return musicKit.getPlayerInstance().changeToMediaAtIndex(index);
  },

  seekToTime(time: number): Promise<void> {
    return musicKit.getPlayerInstance().seekToTime(time);
  },

  changeVolume(volume: number) {
    if (volume < 0 || volume > 1) {
      return;
    }

    musicKit.getPlayerInstance().volume = volume;
  },

  changeRepeatMode(repeatMode: number) {
    if (repeatMode < 0 || repeatMode > 2) {
      return;
    }

    // Repeat mode of MusicKit is 0: Off, 1: One, 2: All, so we need to switch up
    if (repeatMode === RepeatMode.All) {
      repeatMode = RepeatMode.One;
    } else if (repeatMode === RepeatMode.One) {
      repeatMode = RepeatMode.All;
    }

    musicKit.getPlayerInstance().repeatMode = repeatMode;
  }
};

export default musicPlayerService;
