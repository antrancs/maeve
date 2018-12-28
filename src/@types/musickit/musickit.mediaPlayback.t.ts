declare namespace MusicKit {
  /**
   * A media player that represents the media player for a MusicKit instance.
   * Ref: https://developer.apple.com/documentation/musickitjs/musickit/player
   */
  interface Player {
    /**
     * The current bit rate of the music player.
     */
    readonly bitrate: PlaybackBitrate;

    /**
     * The music player has EME loaded.
     */
    readonly canSupportDRM: boolean;

    /**
     * The current playback duration.
     */
    readonly currentPlaybackDuration: any;

    /**
     * The current playback progress.
     */
    readonly currentPlaybackProgress: number;

    /**
     * The current position of the playhead.
     */
    readonly currentPlaybackTime: any;

    /**
     * The current playback duration in hours and minutes.
     */
    readonly formattedCurrentPlaybackDuration: number;

    /**
     * A Boolean value indicating whether the player is currently playing.
     */
    readonly isPlaying: boolean;

    /**
     * The currently-playing media item, or the media item, within an queue, that you have designated to begin playback.
     */
    readonly nowPlayingItem: any;

    /**
     * The index of the now playing item in the current playback queue.
     */
    readonly nowPlayingItemIndex: number | undefined;

    /**
     *  The current playback rate for the player.
     */
    readonly playbackRate: number;

    /**
     * The current playback state of the music player.
     */
    readonly playbackState: PlaybackStates;

    /**
     * A Boolean value that indicates whether a playback target is available.
     */
    readonly playbackTargetAvailable: boolean;

    /**
     * The current playback queue of the music player.
     */
    readonly queue: Queue;

    /**
     * The current repeat mode of the music player.
     */
    repeatMode: PlayerRepeatMode;

    /**
     * The current shuffle mode of the music player.
     */
    shuffleMode: PlayerShuffleMode;

    /**
     * A number indicating the current volume of the music player.
     */
    volume: number;

    /**
     * Adds an event listener as a callback for an event name.
     * @param name The name of the event.
     * @param callback The callback function to invoke when the event occurs.
     */
    addEventListener(name: string, callback: CallbackType): void;

    /**
     * Begins playing the media item at the specified index in the queue immediately.
     * @param index The queue index to begin playing media.
     */
    changeToMediaAtIndex(index: number): Promise<void>;

    /**
     * Begins playing the media item in the queue immediately.
     * @param descriptor A descriptor can be a MusicKit.MediaItem instance or a string identifier.
     * @returns Returns the current media item position.
     */
    changeToMediaItem(descriptor: descriptor): Promise<number>;

    /**
     * Sets the volume to 0.
     */
    mute(): void;

    /**
     * Pauses playback of the current item.
     */
    pause(): void;

    /**
     * Initiates playback of the current item.
     */
    play(): Promise<number>;

    /**
     * Prepares a music player for playback.
     * @param descriptor A descriptor can be a MusicKit.MediaItem instance or a string identifier.
     */
    prepareToPlay(descriptor: descriptor): Promise<void>;

    /**
     * removeEventListener
     * @param name The name of the event.
     * @param callback The callback function to remove.
     */
    removeEventListener(name: string, callback: CallbackType): void;

    /**
     * Sets the playback point to a specified time.
     * @param time The time to set as the playback point.
     */
    seekToTime(time: number): Promise<void>;

    /**
     * Displays the playback target picker if a playback target is available.
     */
    showPlaybackTargetPicker(): void;

    /**
     * Starts playback of the next media item in the playback queue.
     * If the player is not playing, this method designates the next media item as the next to be played.
     * @returns The current media item position.
     */
    skipToNextItem(): Promise<number>;

    /**
     * Starts playback of the previous media item in the playback queue.
     * If the player is not playing, this method designates the previous media item as the next to be played.
     * @returns The current media item position.
     */
    skipToPreviousItem(): Promise<number>;

    /**
     * Stops the currently playing media item.
     */
    stop(): void;
  }

  /**
   * The playback bit rate of the music player.
   * Ref: https://developer.apple.com/documentation/musickitjs/musickit/playbackbitrate
   */
  enum PlaybackBitrate {
    /**
     * The bit rate is 256 kbps.
     */
    HIGH = 'HIGH',

    /**
     * The bit rate is 64 kbps.
     */
    STANDARD = 'STANDARD'
  }

  /**
   * Ref: The playback states of the music player.
   * https://developer.apple.com/documentation/musickitjs/musickit/playbackstates
   */
  enum PlaybackStates {
    /**
     * This value indicates that the player has not attempted to start playback.
     */
    none = 0,
    /**
     * This value indicates that loading of the media item has begun.
     */
    loading = 1,
    /**
     * This value indicates that the player is currently playing media.
     */
    playing = 2,
    /**
     * This value indicates that playback has been paused.
     */
    paused = 3,
    /**
     * This value indicates that plaback has been stopped.
     */
    stopped = 4,
    /**
     * This value indicates that playback of the media item has ended.
     */
    ended = 5,
    /**
     * This value indicates that the player has started a seek operation.
     */
    seeking = 6,
    /**
     * This value indicates that playback is delayed pending the completion of another operation.
     */
    waiting = 8,
    /**
     * This value indicates that the player is trying to fetch media data but cannot retrieve the data.
     */
    stalled = 9,
    /**
     * This value indicates that playback of all media items in the queue has ended.
     */
    completed = 10
  }

  /**
   * Possible values for the repeat mode for the music player.
   * Ref: https://developer.apple.com/documentation/musickitjs/musickit/playerrepeatmode
   */
  enum PlayerRepeatMode {
    /**
     * The current queue will be repeated.
     */
    all = 2,
    /**
     * No repeat mode specified.
     */
    none = 0,
    /**
     * The current media item will be repeated.
     */
    one = 1
  }

  /**
   * The shuffle mode for the music player.
   * Ref: https://developer.apple.com/documentation/musickitjs/musickit/playershufflemode
   */
  enum PlayerShuffleMode {
    /**
     * This value indicates that shuffle mode is off.
     */
    off = 0,
    /**
     * This value indicates that songs are being shuffled in the current queue.
     */
    songs = 1
  }
}
