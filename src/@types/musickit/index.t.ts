// tslint:disable-next-line
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
    bitrate: PlaybackBitrate;

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
    unauthorize(): Promise<void>;

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

  type descriptor = MediaItem | string;
  type QueryParameters = object;
  type AddToLibraryParameters = { [key: string]: any };
  type CallbackType = (...args: any[]) => void;
  type PlaybackProgressDidChangeCallbackType = (event: {
    progress: number;
  }) => void;
  type AnotherType = (event: { timer: string }) => void;

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
    album(id: string, parameters?: QueryParameters): Promise<LibraryAlbum>;

    /**
     * Fetch one or more library albums using their identifiers.
     * If no ids are passed, this method fetches all the library albums in alphabetical order.
     * @param ids An array of library album identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns An array of library album resources.
     */
    albums(
      ids?: string[],
      parameters?: QueryParameters
    ): Promise<LibraryAlbum[]>;

    /**
     * Fetch a library artist using its identifier.
     * @param id A library artist identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns A library artist resource.
     */
    artist(id: string, parameters: QueryParameters): Promise<LibraryArtist>;

    /**
     * Fetch one or more library artists using their identifiers.
     * If no ids are passed, this method fetches all the library artists in alphabetical order.
     * @param ids An array of library artist identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns: An array of library artist resources.
     */
    artists(
      ids?: string[],
      parameters?: QueryParameters
    ): Promise<LibraryArtist[]>;

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
    musicVideos(
      ids?: string[],
      parameters?: QueryParameters
    ): Promise<object[]>;

    /**
     * Fetch a library playlist using its identifier.
     * @param id A library playlist identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns A library playlist resource.
     */
    playlist(
      id: string,
      parameters?: QueryParameters
    ): Promise<LibraryPlaylist>;

    /**
     * Fetch one or more library playlists using their identifiers.
     * If no ids are passed, this method fetches all the library playlists in alphabetical order.
     * @param ids An array of library playlist identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns: An array of library playlist resources.
     */
    playlists(
      ids?: string[],
      parameters?: QueryParameters
    ): Promise<LibraryPlaylist[]>;

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
    song(id: string, parameters: QueryParameters): Promise<LibrarySong>;

    /**
     * Fetch one or more library songs using their identifiers.
     * If no ids are passed, this method fetches all the library songs in alphabetical order.
     * @param ids An array of library song identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Cloud Library API.
     * @returns An array of library song resources.
     */
    songs(ids?: string[], parameters?: QueryParameters): Promise<LibrarySong[]>;
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

    /**
     * Add an event listener for a MusicKit queue by name.
     * @param name The name of the event.
     * @param callback The callback function to invoke when the event occurs.
     */
    addEventListener(name: string, callback: CallbackType): void;

    /**
     * Inserts the media items defined by the queue descriptor after the last media item in the current queue.
     * @param descriptor A queue descriptor.
     */
    append(descriptor: QueueDescriptor): void;

    /**
     * Returns the index in the playback queue for a media item descriptor.
     * @param descriptor A descriptor can be an instance of the MusicKit.MediaItem class, or a string identifier.
     */
    indexForItem(descriptor: descriptor): number;

    /**
     * Returns the media item located in the indicated array index.
     * @param index The array index for the media item.
     */
    item(index: number): MediaItem;

    /**
     * Inserts the media items defined by the queue descriptor into the current queue immediately
     * after the currently playing media item.
     * @param descriptor A queue descriptor.
     */
    prepend(descriptor: QueueDescriptor): void;

    remove(index: number): void;
    /**
     * Removes an event listener for a MusicKit queue by name.
     * @param name The name of the event.
     * @param callback The callback function to remove.
     */
    removeEventListener(name: string, callback: CallbackType): void;
  }

  interface QueueDescriptor {
    items: MediaItem[];
  }
  /**
   * The options to use when setting a music player's playback queue.
   * Ref: https://developer.apple.com/documentation/musickitjs/musickit/setqueueoptions
   */
  interface SetQueueOptions {
    /**
     * The catalog album used to set a music player's playback queue.
     */
    album?: string;

    /**
     * The media items used to set a music player's playback queue.
     */
    items?: MusicKit.descriptor[];

    /**
     * The playlist used to set a music player's playback queue.
     */
    playlist?: string;

    /**
     * The parameters used to set a music player's playback queue.
     */
    parameters?: QueryParameters;

    /**
     * The song used to set a music player's playback queue.
     */
    song?: string;

    /**
     * The songs used to set a music player's playback queue.
     */
    songs?: string[];

    /**
     * The start position for a set playback queue.
     */
    startPosition?: number;

    /**
     * A content URL used to set a music player's playback queue.
     */
    url?: string;
  }

  interface ResourceData {
    data: [Resource];
    href: string;
    next?: string;
  }

  interface PlaylistResourceData extends ResourceData {
    data: [Playlist];
  }

  interface ArtistResourceData extends ResourceData {
    data: [Artist];
  }

  interface AlbumResourceData extends ResourceData {
    data: [Album];
  }

  interface SongResourceData {
    data: [Song];
  }

  enum PlaylistType {
    editorial = 'editorial'
  }

  interface SearchResult {
    albums?: AlbumResponse;
    playlists?: PlaylistResponse;
    songs?: SongResponse;
    artists?: ArtistResponse;
    // [key: string]: ResponseRoot | undefined;
  }

  // REMOVE
  enum Kind {
    album = 'album',
    song = 'song',
    playlist = 'playlist'
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

  class MediaItem {
    constructor(options: MediaItemOptions);
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
    attributes: SongAttributes;

    container?: Playlist | Album;

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

    // songId: string;

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
    type: 'song';
  }

  interface MediaItemOptions {
    attributes?: any;
    id?: string;
    type: string;
    container: {
      id: string;
    };
  }

  // type MediaItemType = 'song';

  /**
   * The JSON root object contained in every response.
   * Ref: https://developer.apple.com/documentation/applemusicapi/responseroot
   */
  interface ResponseRoot {
    /**
     * The primary data for a request or response. If data exists, this property is an array of one
     * or more resource objects. If no data exists, this property is an empty array or null.
     */
    data?: Resource[];

    /**
     * An array of one or more errors that occurred while executing the operation.
     */
    errors?: MusicKit.Error[];

    /**
     * A link to the request that generated the response data or results; not present in a request.
     */
    href?: string;

    /**
     *  Information about the request or response. The members may be any of the endpoint parameters.
     */
    meta?: any;

    /**
     *  A link to the next page of data or results; contains the offset query parameter
     *  that specifies the next page. See Fetch Resources by Page.
     */
    next?: string;

    /**
     * The results of the operation. If there are results, the object contains contents;
     * otherwise, it is empty or null.
     */
    results?: any;
  }

  /**
   * Information about an error that occurred while processing a request.
   * Ref: https://developer.apple.com/documentation/applemusicapi/error
   */
  interface Error {
    /**
     * The code for this error. For possible values, see HTTP Status Codes.
     */
    code: string;

    /**
     * A long description of the problem; may be localized.
     */
    detail?: string;

    /**
     * A unique identifier for this occurrence of the error.
     */
    id: string;

    /**
     * A object containing references to the source of the error. For possible members, see Source object.
     */
    source?: ErrorSource;

    /**
     * The HTTP status code for this problem.
     */
    status: string;

    /**
     * A short description of the problem; may be localized.
     */
    title: string;
  }

  /**
   * The response to an album request.
   * Ref: https://developer.apple.com/documentation/applemusicapi/albumresponse
   */
  interface AlbumResponse extends ResponseRoot {
    data: Album[];
  }

  interface ArtistResponse extends ResponseRoot {
    data: Artist[];
  }

  interface PlaylistResponse extends ResponseRoot {
    data: Playlist[];
  }

  interface SongResponse extends ResponseRoot {
    data: Song[];
  }

  /**
   * The Source object represents the source of an error.
   * Ref: https://developer.apple.com/documentation/applemusicapi/error/source
   */
  interface ErrorSource {
    /**
     * The URI query parameter that caused the error.
     */
    parameter: string;

    /**
     *  A pointer to the associated entry in the request document.
     */
    pointer: any;
  }
}
