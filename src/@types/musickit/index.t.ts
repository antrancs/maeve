declare namespace MusicKit {
  /**
   * Configure a MusicKit instance.
   * @param configuration A dictionary of configuration options for the MusicKit instance.
   * @returns A configured MusicKit instance.
   */
  function configure(configuration: Configuration): MusicKitInstance;

  /**
   * Returns the configured MusicKit instance.
   */
  function getInstance(): MusicKitInstance;

  interface AppConfiguration {
    build?: string;
    icon?: string;
    name?: string;
    version?: string;
  }

  /**
   * A dictionary used to configure the MusicKit instance.
   */
  interface Configuration {
    developerToken?: string;
    app?: AppConfiguration;
  }

  interface MusicKitInstance {
    /**
     * An instance of the MusicKit API.
     * This instance includes methods to handle interactions with the Apple Music API.
     */
    readonly api: API;

    /**
     * The current bit rate for the media player.
     */
    readonly bitrate: PlaybackBitrate;

    /**
     * The developer token to identify yourself as a trusted developer and member of the Apple Developer Program.
     */
    readonly developerToken: string;

    /**
     * A Boolean value indicating whether the user has authenticated and authorized the application for use.
     */
    readonly isAuthorized: boolean;

    /**
     * A user token used to access personalized Apple Music content.
     */
    readonly musicUserToken: string;

    /**
     * The current playback state of the music player.
     */
    readonly playbackState: PlaybackStates;

    /**
     * A Boolean value that indicates if a playback target is available.
     */
    readonly playbackTargetAvailable: boolean;

    /**
     * An instance of the MusicKit player.
     */
    readonly player: Player;

    /**
     * The current storefront for the configured MusicKit instance.
     */
    readonly storefrontId: string;

    /**
     * Add an event listener for a MusicKit instance by name.
     * @param name The name of the event.
     * @param callback The callback function to invoke when the event occurs.
     */
    addEventListener(name: string, callback: CallbackType): void;

    /**
     * Returns a promise containing a music user token when a user has authenticated and authorized the app.
     * @returns Returns a promise that resolves with a musicUserToken.
     */
    authorize(): Promise<string>;

    /**
     * Removes an event listener for a MusicKit instance by name.
     * @param name The name of the event.
     * @param callback The callback function to remove.
     */
    removeEventListener(name: string, callback?: CallbackType): void;

    /**
     * Unauthorizes the app for the current user.
     */
    unauthorize(): void;

    /**
     * Pauses playback of the media player.
     */
    pause(): void;

    /**
     * Begins playback of the current media item.
     * @returns The current media item position.
     */
    play(): Promise<number>;

    /**
     * Sets a music player's playback queue using queue options.
     * This method returns a promise with an instance of the set music player's playback queue.
     * Because we cannot programatically differentiate between an album or a song from the content identifier,
     * the declaritive markup assumes album, unless specified with the data-apple-music-media-type attribute.
     * @param option The option used to set the playback queue.
     * @returns The current playback queue.
     */
    setQueue(options: SetQueueOptions): Promise<Queue>;
  }

  enum PlaybackBitrate {
    HIGH = 'HIGH',
    STANDARD = 'STANDARD'
  }

  enum PlaybackStates {
    completed = 'completed',
    ended = 'ended',
    loading = 'loading',
    none = 'none',
    paused = 'paused',
    playing = 'playing',
    seeking = 'seeking',
    stalled = 'stalled',
    stopped = 'stopped',
    waiting = 'waiting'
  }

  enum PlayerRepeatMode {
    all = 'all',
    none = 'none',
    one = 'one'
  }

  enum PlayerShuffleMode {
    off = 'off',
    songs = 'songs'
  }

  type descriptor = MediaItem | string;
  type QueryParameters = object;
  type AddToLibraryParameters = { [key: string]: any };
  type CallbackType = (...args: any[]) => void;
  type PlaybackProgressDidChangeCallbackType = (
    event: { progress: number }
  ) => void;
  type AnotherType = (event: { timer: string }) => void;

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
    readonly repeatMode: PlayerRepeatMode;

    /**
     * The current shuffle mode of the music player.
     */
    readonly shuffleMode: PlayerShuffleMode;

    /**
     * A number indicating the current volume of the music player.
     */
    readonly volume: number;

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
    play(): Promise<void>;

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
   * This class represents the Apple Music API.
   */
  interface API {
    /**
     * An instance of the Cloud library.
     */
    library: Library;

    /**
     * The storefront used for making calls to the API.
     */
    storefrontId: string;

    /**
     * Fetch one or more activites using their identifiers.
     * @param ids An array of activity identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns An array of activity resources.
     */
    activities(ids: string[], parameters: QueryParameters): Promise<object[]>;

    /**
     * Fetch an activity using its identifier.
     * @param id An activity identifier.
     * @param parameters A query params object that is serialized and passed directly to the Apple Music API.
     * @returns An activity resource.
     */
    activity(id: string, parameters: QueryParameters): Promise<object>;

    /**
     * Add a catalog resource to a user's library.
     * @param parameters A dictionary containing the items to add to the library.
     */
    addToLibrary(parameters: AddToLibraryParameters): Promise<void>;

    /**
     * Fetch an album using its identifier.
     * @param id An album identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns An album resource.
     */
    album(id: string, parameters: QueryParameters): Promise<MediaResource>;

    /**
     * Fetch one or more albums using their identifiers.
     * @param ids An array of album identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API
     * @returns An array of album resources.
     */
    albums(ids: string[], parameters: QueryParameters): Promise<object[]>;

    /**
     * Fetch an Apple curator using its identifier.
     * @param id An Apple curator identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns An Apple curator resource.
     */
    appleCurator(id: string, parameters: QueryParameters): Promise<object>;

    /**
     * Fetch one or more Apple curators using their identifiers.
     * @param id An array of Apple curator identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns An array of Apple curator resources.
     */
    appleCurators(
      ids: string[],
      parameters: QueryParameters
    ): Promise<object[]>;

    /**
     * Fetch an artist using its identifier.
     * @param id An artist identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns An artist resource.
     */
    artist(id: string, parameters: QueryParameters): Promise<MediaResource>;

    /**
     * Fetch an artist using its identifier.
     * @param id A playlist identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns A playlist resource.
     */
    playlist(id: string, parameters: QueryParameters): Promise<MediaResource>;

    /**
     * Search the catalog using a query.
     * @param term The term to search.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     */
    search(term: string, parameters: QueryParameters): Promise<SearchResult>;
  }

  /**
   * This class represents a user's Cloud Library.
   */
  interface Library {
    /**
     * Fetch a library album using its identifier.
     * @param id A library album identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns A library album resource.
     */
    album(id: string, parameters: QueryParameters): Promise<object>;

    /**
     * Fetch one or more library albums using their identifiers.
     * If no ids are passed, this method fetches all the library albums in alphabetical order.
     * @param ids An array of library album identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns An array of library album resources.
     */
    albums(ids: string[], parameters: QueryParameters): Promise<object[]>;

    /**
     * Fetch a library artist using its identifier.
     * @param id A library artist identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns A library artist resource.
     */
    artist(id: string, parameters: QueryParameters): Promise<object>;

    /**
     * Fetch one or more library artists using their identifiers.
     * If no ids are passed, this method fetches all the library artists in alphabetical order.
     * @param ids An array of library artist identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns: An array of library artist resources.
     */
    artists(ids: string[], parameters: QueryParameters): Promise<object[]>;

    /**
     * Fetch a library music video using its identifier.
     * @param id A library music video identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns A library music video resource.
     */
    musicVideo(id: string, parameters: QueryParameters): Promise<object>;

    /**
     * Fetch one or more library artists using their identifiers.
     * If no ids are passed, this method fetches all the library music videos in alphabetical order.
     * @param ids An array of library music video identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns: An array of library music video resources.
     */
    musicVideos(ids: string[], parameters: QueryParameters): Promise<object[]>;

    /**
     * Fetch a library playlist using its identifier.
     * @param id A library playlist identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns A library playlist resource.
     */
    playlist(id: string, parameters: QueryParameters): Promise<object>;

    /**
     * Fetch one or more library playlists using their identifiers.
     * If no ids are passed, this method fetches all the library playlists in alphabetical order.
     * @param ids An array of library playlist identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns: An array of library playlist resources.
     */
    playlists(ids: string[], parameters: QueryParameters): Promise<object[]>;

    /**
     * Search the library using a query.
     * @param term The term to search.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns An array of library resources.
     */
    search(term: string, parameters: QueryParameters): Promise<object[]>;

    /**
     * Fetch a library song using its identifier.
     * @param id A library song identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns A library song resource.
     */
    song(id: string, parameters: QueryParameters): Promise<object>;

    /**
     * Fetch one or more library songs using their identifiers.
     * If no ids are passed, this method fetches all the library songs in alphabetical order.
     * @param ids An array of library song identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns An array of library song resources.
     */
    songs(ids: string[], parameters: QueryParameters): Promise<object[]>;
  }

  interface Queue {
    /**
     * A Boolean value indicating whether the queue has no items.
     */
    isEmpty: boolean;

    /**
     * An array of all the media items in the queue.
     */
    items: MediaItem[];

    /**
     * The number of items in the queue.
     */
    length: number;

    /**
     * The next playable media item in the queue.
     */
    nextPlayableItem: MediaItem | undefined;

    /**
     * The current queue position.
     */
    position: number;

    /**
     * The previous playable media item in the queue
     */
    previousPlayableItem: MediaItem | undefined;
  }

  /**
   * The catalog album used to set a music player's playback queue.
   */
  interface SetQueueOptions {
    /**
     * The catalog album used to set a music player's playback queue.
     */
    album?: string;

    /**
     * The catalog album used to set a music player's playback queue.
     */
    albums?: string[];

    /**
     * The playlist used to set a music player's playback queue.
     */
    playlist?: string;

    /**
     * The song used to set a music player's playback queue.
     */
    song?: string;

    /**
     * The start position for a set playback queue.
     */
    startPosition?: number;
  }

  interface MediaItem {
    /**
     * A string of information about the album.
     */
    albumInfo: string;

    /**
     * The title of the album.
     */
    albumName: string;

    /**
     * The artist for a media item.
     */
    artistName: string;

    /**
     * The artwork object for the media item.
     */
    artwork: Artwork;

    /**
     * The artwork image for the media item.
     */
    artworkURL: string;

    /**
     * The attributes object for the media item.
     */
    attributes: MediaResourceSongAttributes;

    /**
     * A string containing the content rating for the media item.
     */
    contentRating: string | undefined;

    /**
     * The disc number where the media item appears.
     */
    discNumber: number;

    /**
     * The identifier for the media item.
     */
    id: string;

    /**
     * A string of common information about the media item.
     */
    info: string;

    /**
     * A Boolean value that indicates whether the item has explicit lyrics or language.
     */
    isExplicitItem: boolean;

    /**
     * A Boolean value that indicated whether the item is playable.
     */
    isPlayable: boolean;

    /**
     * A Boolean value indicating whether the media item is prepared to play.
     */
    isPreparedToPlay: boolean;

    /**
     * The ISRC (International Standard Recording Code) for a media item.
     */
    isrc: string;

    /**
     * The playback duration of the media item.
     */
    playbackDuration: any;

    /**
     * The URL to an unencrypted preview of the media item.
     */
    previewURL: Preview;

    /**
     * The release date of the media item.
     */
    releaseDate: Date | undefined;

    /**
     * The name of the media item.
     */
    title: string;

    /**
     * The number of the media item in the album's track list.
     */
    trackNumber: number;

    /**
     * The type of the media item.
     */
    type: MediaItemType;
  }

  interface MediaItemOptions {
    attributes?: any;
    id?: string;
  }

  enum MediaItemType {
    song = 'song'
  }

  enum MediaResourceType {
    album = 'albums',
    song = 'songs',
    artist = 'artists',
    playlist = 'playlists'
  }

  interface MediaResourceSongAttributes {
    albumName: string;

    artistName: string;

    artwork: Artwork;

    discNumber: number;

    durationInMillis: number;

    genreNames: string[];

    isrc: string;

    name: string;

    playParams: PlayParam;

    previews: Preview[];

    releaseDate: string;

    trackNumber: number;

    url: string;
  }

  interface MediaResourceArtistAttributes {
    genreNames: string[];
    name: string;
    url: string;
  }

  interface MediaResourcePlaylistAttributes {
    artwork: Artwork;
    curatorName: string;
    description: CollectionDescription;
    lastModifiedDate: string;
    name: string;
    playParams: PlayParam;
    playlistType: PlaylistType;
    url: string;
  }

  interface MediaResourceAlbumAttributes {
    artistName: string;
    artwork: Artwork;
    contentRating: string; // 'explicit', maybe an enum
    copyright: string;
    editorialNotes: CollectionDescription;
    genreNames: string[];
    isComplete: boolean;
    isMasteredForItunes: boolean;
    isSingle: boolean;
    name: string;
    playParams: PlayParam;
    recordLabel: string;
    releaseDate: string;
    trackCount: number;
    url: string;
  }

  interface MediaResource {
    attributes:
      | MediaResourceAlbumAttributes
      | MediaResourceSongAttributes
      | MediaResourceArtistAttributes
      | MediaResourcePlaylistAttributes;
    id: string;
    href: string;
    type: MediaResourceType;
    relationships?: MediaResourceRelationship;
  }

  interface MediaResourceRelationship {
    type: MediaResourceType;
    [MediaResourceType.album]?: ResourceData;
    [MediaResourceType.playlist]?: ResourceData;
    tracks?: ResourceData;
  }

  interface ResourceData {
    data: [MediaResource];
    href: String;
    next?: String;
  }

  interface Artwork {
    bgColor: string;
    height: number;
    textColor1: string;
    textColor2: string;
    textColor3: string;
    textColor4: string;
    url: string;
    width: number;
  }

  interface CollectionDescription {
    short: string;
    standard: string;
  }

  interface PlayParam {
    id: String;
    kind: Kind;
  }

  enum Kind {
    album = 'album',
    song = 'song',
    playlist = 'playlist'
  }

  enum PlaylistType {
    editorial = 'editorial'
  }

  interface Preview {
    url: string;
  }

  interface SearchResult {
    [MediaResourceType.album]?: ResourceData;
    [MediaResourceType.playlist]?: ResourceData;
    [MediaResourceType.song]?: ResourceData;
    [MediaResourceType.artist]?: ResourceData;
  }

  enum Events {
    authorizationStatusDidChange = 'authorizationStatusDidChange',
    authorizationStatusWillChange = 'authorizationStatusWillChange',
    bufferedProgressDidChange = 'bufferedProgressDidChange',
    eligibleForSubscribeView = 'eligibleForSubscribeView',
    loaded = 'musickitloaded',
    mediaCanPlay = 'mediaCanPlay',
    mediaItemDidChange = 'mediaItemDidChange',
    mediaItemStateDidChange = 'mediaItemStateDidChange',
    mediaItemStateWillChange = 'mediaItemStateWillChange',
    mediaItemWillChange = 'mediaItemWillChange',
    mediaPlaybackError = 'mediaPlaybackError',
    metadataDidChange = 'metadataDidChange',
    playbackBitrateDidChange = 'playbackBitrateDidChange',
    playbackDurationDidChange = 'playbackDurationDidChange',
    playbackProgressDidChange = 'playbackProgressDidChange',
    playbackStateDidChange = 'playbackStateDidChange',
    playbackStateWillChange = 'playbackStateWillChange',
    playbackTargetAvailableDidChange = 'playbackTargetAvailableDidChange',
    playbackTimeDidChange = 'playbackTimeDidChange',
    playbackVolumeDidChange = 'playbackVolumeDidChange',
    primaryPlayerDidChange = 'primaryPlayerDidChange',
    queueItemForStartPosition = 'queueItemForStartPosition',
    queueItemsDidChange = 'queueItemsDidChange',
    queuePositionDidChange = 'queuePositionDidChange',
    storefrontCountryCodeDidChange = 'storefrontCountryCodeDidChange',
    storefrontIdentifierDidChange = 'storefrontIdentifierDidChange',
    userTokenDidChange = 'userTokenDidChange'
  }
}

// declare var MusicKitInstance: MusicKit.MusicKitInstance;
