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
    album(id: string, parameters: QueryParameters): Promise<Album>;

    /**
     * Fetch one or more albums using their identifiers.
     * @param ids An array of album identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API
     * @returns An array of album resources.
     */
    albums(ids: string[], parameters: QueryParameters): Promise<Album[]>;

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
    artist(id: string, parameters: QueryParameters): Promise<Artist>;

    /**
     * Fetch an artist using its identifier.
     * @param id A playlist identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns A playlist resource.
     */
    playlist(id: string, parameters: QueryParameters): Promise<Playlist>;

    /**
     * Search the catalog using a query.
     * @param term The term to search.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     */
    search(term: string, parameters: QueryParameters): Promise<SearchResult>;

    /**
     * Fetch a storefront using its identifier.
     * @param id A storefront identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns A storefront resource.
     */
    storefront(id: string, parameters: QueryParameters): Promise<any>;

    recommendations(): Promise<Recommendation[]>;
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
      ids: string[],
      parameters: QueryParameters
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
    songs(ids: string[], parameters: QueryParameters): Promise<LibrarySong[]>;
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

  interface Artwork {
    /**
     * The average background color of the image.
     */
    bgColor?: string;

    /**
     * (Required) The maximum height available for the image.
     */
    height: number;

    /**
     * The primary text color that may be used if the background color is displayed.
     */
    textColor1?: string;

    /**
     * The secondary text color that may be used if the background color is displayed.
     */
    textColor2?: string;

    /**
     * The tertiary text color that may be used if the background color is displayed
     */
    textColor3?: string;

    /**
     * The final post-tertiary text color that may be used if the background color is displayed.
     */
    textColor4?: string;

    /**
     * (Required) The URL to request the image asset. The image filename must be preceded by {w}x{h},
     * as placeholders for the width and height values as described above (for example, {w}x{h}bb.jpeg).
     */
    url: string;

    /**
     * (Required) The maximum width available for the image.
     */
    width: number;
  }

  enum PlaylistType {
    editorial = 'editorial'
  }

  /**
   * An object that represents a preview for resources.
   * Ref: https://developer.apple.com/documentation/applemusicapi/preview
   */
  interface Preview {
    /**
     * The preview artwork for the associated music video.
     */
    artwork?: Artwork;

    /**
     * (Required) The preview URL for the content.
     */
    url: string;
  }

  interface SearchResult {
    albums: {
      data: [Album];
      href: string;
      next?: string;
    };

    playlists: {
      data: [Playlist];
      href: string;
      next?: string;
    };

    songs?: {
      data: [Song];
      href: string;
      next?: string;
    };

    artists?: {
      data: [Artist];
      href: string;
      next?: string;
    };

    [key: string]: any;
  }

  // REMOVE
  enum Kind {
    album = 'album',
    song = 'song',
    playlist = 'playlist'
  }

  interface PlaylistContainer {
    attributes: PlaylistAttributes;
    id: string;
    name: Kind.playlist;
    type: 'playlists';
  }

  interface AlbumContainer {
    attributes: AlbumAttributes;
    id: string;
    name: Kind.album;
    type: 'albums';
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

    container: PlaylistContainer | AlbumContainer;

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
    type: MediaItemType;
  }

  interface MediaItemOptions {
    attributes?: any;
    id?: string;
    type: MediaItemType;
  }

  type MediaItemType = 'song';

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

  /////// New /////////////
  /**
   * A resource—such as an album, song, or playlist—in the Apple Music catalog or iCloud Music Library.
   * A Resource object may contain just these identifier members: id, type, href, and meta.
   * Ref: https://developer.apple.com/documentation/applemusicapi/resource
   */
  interface Resource {
    /**
     * Attributes belonging to the resource (can be a subset of the attributes).
     * The members are the names of the attributes defined in the object model.
     */
    attributes?: ResourceAttributes;
    /**
     * (Required) Persistent identifier of the resource.
     */
    id: string;

    /**
     * A URL subpath that fetches the resource as the primary object.
     * This member is only present in responses.
     */
    href?: string;

    /**
     * Relationships belonging to the resource (can be a subset of the relationships).
     * The members are the names of the relationships defined in the object model.
     */
    relationships?: ResourceRelationships;

    /**
     * (Required) The type of resource.
     */
    type: string;
  }

  interface ResourceRelationships {}

  interface ResourceAttributes {}

  /**
   * A to-one or to-many relationship from one resource object to others.
   * A to-one relationship contains a single object in the data array.
   * The rules that apply to the members of this object are:
   *    + Must contain one of these members: href, data, or meta.
   *    + If a to-many relationship, may contain the next member.
   * Ref: https://developer.apple.com/documentation/applemusicapi/relationship
   */
  interface Relationship {
    /**
     * One or more destination objects.
     */
    data?: Resource[];

    /**
     * A URL subpath that fetches the resource as the primary object.
     * This member is only present in responses.
     */
    href?: string;

    /**
     * Link to the next page of resources in the relationship.
     * Contains the offset query parameter that specifies the next page.
     */
    next?: string;
  }

  /**
   * A Resource object that represents an album.
   */
  interface Album extends Resource {
    /**
     * The attributes for the album.
     */
    attributes?: AlbumAttributes;

    /**
     * The relationships for the album.
     */
    relationships?: AlbumRelationships;

    /**
     * (Required) This value will always be albums.
     */
    type: string;
  }

  /**
   * A Resource object that represents a playlist.
   * Ref: https://developer.apple.com/documentation/applemusicapi/playlist
   */
  interface Playlist extends Resource {
    /**
     * The attributes for the playlist.
     */
    attributes?: PlaylistAttributes;

    /**
     * The relationships for the playlist.
     */
    relationships?: PlaylistRelationships;

    /**
     * (Required) This value will always be playlists.
     */
    type: string;
  }

  /**
   * A Resource object that represents an artist of an album where an artist can be one or more persons.
   * Ref: https://developer.apple.com/documentation/applemusicapi/artist
   */
  interface Artist extends Resource {
    /**
     * The attributes for the artist.
     */
    attributes?: ArtistAttributes;

    /**
     * The relationships for the artist.
     */
    relationships?: ArtistRelationships;

    /**
     * (Required) This value will always be artists.
     */
    type: string;
  }

  /**
   * A Resource object that represents a song.
   * Ref: https://developer.apple.com/documentation/applemusicapi/song
   */
  interface Song extends Resource {
    /**
     * The attributes for the song.
     */
    attributes?: SongAttributes;

    /**
     * The relationships for the song.
     */
    relationships?: SongRelationships;

    /**
     * (Required) This value will always be songs.
     */
    type: string;
  }

  /**
   * An object that represents a genre for resources.
   * Ref: https://developer.apple.com/documentation/applemusicapi/genre
   */
  interface Genre extends Resource {
    /**
     * The attributes for the genre.
     */
    attributes?: GenreAttributes;

    /**
     * (Required) This value will always be genres.
     */
    type: string;
  }

  /**
   * A Resource object that represents recommended resources for a user calculated using their selected preferences.
   * Ref: https://developer.apple.com/documentation/applemusicapi/recommendation
   */
  interface Recommendation extends Resource {
    /**
     * The attributes for the recommendation.
     */
    attributes?: RecommendationAttributes;

    /**
     * For contents, a list of recommended candidates that are a mixture of albums and playlists.
     * For recommendations, a list of recommendations within a group.
     */
    relationships?: RecommendationRelationships;

    /**
     * (Required) This value will always be personal-recommendation.
     */
    type: string;

    /**
     * (Required) The URL for the next page.
     */
    next: string;

    /**
     * (Required) The ID of the recommendation.
     */
    id: string;

    /**
     * (Required) The URL for the recommendation.
     */
    href: string;
  }

  /**
   * A Resource object that represents a library album.
   * Ref: https://developer.apple.com/documentation/applemusicapi/libraryalbum
   */
  interface LibraryAlbum extends Resource {
    /**
     * The attributes for the library album.
     */
    attributes?: LibraryAlbumAttributes;

    /**
     * The relationships for the library album.
     */
    relationships?: LibraryAlbumRelationships;

    /**
     * (Required) This value will always be libraryAlbums.
     */
    type: string;
  }

  /**
   * A Resource object that represents a library artist.
   * Ref: https://developer.apple.com/documentation/applemusicapi/libraryartist
   */
  interface LibraryArtist extends Resource {
    /**
     * The attributes for the library artist.
     */
    attributes?: LibraryArtistAttributes;

    /**
     * The relationships for the library artist.
     */
    relationships?: LibraryArtistRelationships;

    /**
     * (Required) This value will alway be libraryArtists.
     */
    type: string;
  }

  /**
   * A Resource object that represents a library song.
   * Ref: https://developer.apple.com/documentation/applemusicapi/librarysong
   */
  interface LibrarySong extends Resource {
    /**
     * The attributes for the library song.
     */
    attributes?: LibrarySongAttributes;

    /**
     * The relationships for the library song.
     */
    relationships?: LibrarySongRelationships;

    /**
     * (Required) This value will alway be librarySongs.
     */
    type: string;
  }

  /**
   * A Resource object that represents a library playlist.
   * Ref: https://developer.apple.com/documentation/applemusicapi/libraryplaylist
   */
  interface LibraryPlaylist extends Resource {
    /**
     * The attributes for the library playlist.
     */
    attributes?: LibraryPlaylistAttributes;

    /**
     * The relationships for the library playlist.
     */
    relationships?: LibraryPlaylistRelationships;

    /**
     * (Required) This value will alway be libraryPlaylists.
     */
    type: string;
  }

  /**
   * The attributes for a library playlist object.
   */
  interface LibraryPlaylistAttributes {
    /**
     * The playlist artwork.
     */
    artwork?: Artwork;

    /**
     * A description of the playlist.
     */
    description?: string;

    /**
     * (Required) The localized name of the album.
     */
    name: string;

    /**
     * The parameters to use to play back the tracks in the playlist.
     */
    playParams?: PlayParameters;

    /**
     * (Required) Indicates whether the playlist can be edited.
     */
    canEdit: boolean;
  }
  /**
   * The attributes for a library song object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/librarysong/attributes
   */
  interface LibrarySongAttributes {
    /**
     * (Required) The name of the album the song appears on.
     */
    albumName: string;

    /**
     * (Required) The artist’s name.
     */
    artistName: string;

    /**
     * (Required) The album artwork.
     */
    artwork: Artwork;

    /**
     * The Recording Industry Association of America (RIAA) rating of the content.
     * The possible values for this rating are clean and explicit. No value means no rating.
     */
    contentRating?: string;

    /**
     * (Required) The disc number the song appears on.
     */
    discNumber: number;

    /**
     * The approximate length of the song in milliseconds.
     */
    durationInMillis?: number;

    /**
     * (Required) The localized name of the song.
     */
    name: string;

    /**
     * The parameters to use to playback the song.
     */
    playParams?: PlayParameters;

    /**
     * (Required) The number of the song in the album’s track list.
     */
    trackNumber: number;
  }

  interface LibraryAlbumAttributes {
    /**
     * (Required) The artist’s name.
     */
    artistName: string;

    /**
     * (Required) The album artwork.
     */
    artwork: Artwork;

    /**
     * The Recording Industry Association of America (RIAA) rating of the content.
     * The possible values for this rating are clean and explicit. No value means no rating.
     */
    contentRating: string;

    /**
     * (Required) The localized name of the album.
     */
    name: string;

    /**
     * The parameters to use to playback the tracks of the album.
     */
    playParams?: PlayParameters;

    /**
     * (Required) The number of tracks.
     */
    trackCount: number;
  }
  /**
   * The attributes for a recommendation object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/recommendation/attributes
   */
  interface RecommendationAttributes {
    /**
     * (Required) Whether the recommendation is of group type.
     */
    isGroupRecommendation: boolean;

    /**
     * (Required) The date in UTC format when the recommendation is updated.
     */
    nextUpdateDate: Date;

    /**
     * (Required) The localized reason for the recommendation.
     */
    reason: string;

    /**
     * (Required) The resource types supported by the recommendation.
     */
    resourceTypes: string[];

    /**
     * (Required) The localized title for the recommendation.
     */
    title: string;
  }

  /**
   * The attributes for an artist object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/artist/attributes
   */
  interface ArtistAttributes {
    /**
     * The notes about the artist that appear in the iTunes Store.
     */
    editorialNotes?: EditorialNotes;

    /**
     * (Required) The names of the genres associated with this artist.
     */
    genreNames: string[];

    /**
     * (Required) The localized name of the artist.
     */
    name: string;

    /**
     * (Required) The URL for sharing an artist in the iTunes Store.
     */
    url: string;
  }

  /**
   * The attributes for a song object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/song/attributes
   */
  interface SongAttributes {
    /**
     * (Required) The name of the album the song appears on.
     */
    albumName: string;

    /**
     * (Required) The artist’s name.
     */
    artistName: string;

    /**
     * (Required) The album artwork.
     */
    artwork: Artwork;

    /**
     * The song’s composer.
     */
    composerName?: string;

    /**
     * The Recording Industry Association of America (RIAA) rating of the content.
     * The possible values for this rating are clean and explicit. No value means no rating.
     */
    contentRating?: string;

    /**
     * (Required) The disc number the song appears on.
     */
    discNumber: number;

    /**
     * The duration of the song in milliseconds.
     */
    durationInMillis?: number;

    /**
     * The notes about the song that appear in the iTunes Store.
     */
    editorialNotes?: EditorialNotes;

    /**
     * (Required) The genre names the song is associated with.
     */
    genreNames: string[];

    /**
     * (Required) The International Standard Recording Code (ISRC) for the song.
     */
    isrc: string;

    /**
     * (Classical music only) The movement count of this song.
     */
    movementCount: number;

    /**
     * (Classical music only) The movement name of this song.
     */
    movementName: string;

    /**
     * (Classical music only) The movement number of this song.
     */
    movementNumber: number;

    /**
     * (Required) The localized name of the song.
     */
    name: string;

    /**
     * The parameters to use to playback the song.
     */
    playParams?: PlayParameters;

    /**
     * (Required) The preview assets for the song.
     */
    previews: Preview[];

    /**
     * (Required) The release date of the song in YYYY-MM-DD format.
     */
    releaseDate: string;

    /**
     * (Required) The number of the song in the album’s track list.
     */
    trackNumber: number;

    /**
     * (Required) The URL for sharing a song in the iTunes Store.
     */
    url: string;

    /**
     * (Classical music only) The name of the associated work.
     */
    workName?: string;
  }

  /**
   * The attributes for an album object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/album/attributes
   */
  interface AlbumAttributes {
    /**
     * (Required) The name of the album the music video appears on.
     */
    albumName: string;

    /**
     * (Required) The artist’s name.
     */
    artistName: string;

    /**
     * The album artwork.
     */
    artwork?: Artwork;

    /**
     * The Recording Industry Association of America (RIAA) rating of the content.
     * The possible values for this rating are clean and explicit. No value means no rating.
     */
    contentRating?: string;

    /**
     * The copyright text.
     */
    copyright?: string;

    /**
     * The notes about the album that appear in the iTunes Store.
     */
    editorialNotes?: EditorialNotes;

    /**
     * (Required) The names of the genres associated with this album.
     */
    genreNames: string[];

    /**
     * (Required) Indicates whether the album is complete. If true, the album is complete; otherwise, it is not.
     * An album is complete if it contains all its tracks and songs.
     */
    isComplete: boolean;

    /**
     * (Required) Indicates whether the album contains a single song.
     */
    isSingle: boolean;

    /**
     * (Required) The localized name of the album.
     */
    name: string;

    /**
     * The parameters to use to play back the tracks of the album.
     */
    playParams?: PlayParameters;

    /**
     * (Required) The name of the record label for the album.
     */
    recordLabel: string;

    /**
     * (Required) The release date of the album in YYYY-MM-DD format.
     */
    releaseDate: Date;

    /**
     * (Required) The number of tracks.
     */
    trackCount: number;

    /**
     * (Required) The URL for sharing the album in the iTunes Store.
     */
    url: string;

    /**
     * (Required) Indicates whether the album has been delivered as Mastered for iTunes.
     */
    isMasteredForItunes: boolean;
  }

  /**
   * The attributes for a playlist object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/playlist/attributes
   */
  interface PlaylistAttributes {
    /**
     * The playlist artwork.
     */
    artwork?: Artwork;

    /**
     * The display name of the curator.
     */
    curatorName?: string;

    /**
     * A description of the playlist.
     */
    description?: EditorialNotes;

    /**
     * (Required) The date the playlist was last modified.
     */
    lastModifiedDate: Date;

    /**
     * (Required) The localized name of the album.
     */
    name: string;

    /**
     * The parameters to use to play back the tracks in the playlist.
     */
    playParams?: PlayParameters;

    /**
     * (Required) The type of playlist. Possible values are:
     *  + user-shared: A playlist created and shared by an Apple Music user.
     *  + editorial: A playlist created by an Apple Music curator.
     *  + external: A playlist created by a non-Apple curator or brand.
     *  + personal-mix: A personalized playlist for an Apple Music user.
     *    Possible values: user-shared, editorial, external, personal-mix
     */
    playlistType: string;

    /**
     * (Required) The URL for sharing an album in the iTunes Store.
     */
    url: string;
  }

  /**
   * The attributes for a genre object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/genre/attributes
   */
  interface GenreAttributes {
    /**
     * (Required) The localized name of the genre.
     */
    name: string;
  }

  interface EditorialNotes {
    /**
     * (Required) Notes shown when the content is prominently displayed.
     */
    short: string;

    /**
     * (Required) Abbreviated notes shown inline or when the content is shown alongside other content.
     */
    standard: string;
  }

  /**
   * The attributes for a library artist object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/libraryartist/attributes
   */
  interface LibraryArtistAttributes {
    /**
     * (Required) The artist’s name.
     */
    name: string;
  }

  /**
   * An object that represents play parameters for resources.
   * Ref: https://developer.apple.com/documentation/applemusicapi/playparameters
   */
  interface PlayParameters {
    /**
     * (Required) The ID of the content to use for playback.
     */
    id: string;

    /**
     * (Required) The kind of the content to use for playback.
     */
    kind: string;
  }

  /**
   * The relationships for an album object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/album/relationships
   */
  interface AlbumRelationships {
    /**
     * The artists associated with the album. By default, artists includes identifiers only.
     * Fetch limits: 10 default, 10 maximum
     */
    artists?: ArtistRelationship;

    /**
     * The genres for the album. By default, genres is not included.
     * Fetch limits: None
     */
    genres?: GenreRelationship;

    /**
     * The songs and music videos on the album. By default, tracks includes objects.
     * Fetch limits: 300 default, 300 maximum
     */
    tracks?: TrackRelationship;
  }

  /**
   * The relationships for a library album object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/libraryalbum/relationships
   */
  interface LibraryAlbumRelationships {
    /**
     * The library artists associated with the album. By default, artists is not included.
     * Fetch limits: 10 default, 10 maximum
     */
    artists: LibraryArtistRelationship;

    /**
     * The library songs and library music videos on the album.
     * Only available when fetching single library album resource by ID. By default, tracks includes objects.
     * Fetch limits: 300 default, 300 maximum
     */
    tracks: LibraryTrackRelationship;
  }

  /**
   * The relationships for a recommendation object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/recommendation/relationships
   */
  interface RecommendationRelationships {
    /**
     * The contents associated with the content recommendation type. By default, contents includes objects.
     * Fetch limits: 10 default, 10 maximum
     */
    contents?: Relationship;

    /**
     * The recommendations associated with the group recommendation type.
     * By default, recommendations includes objects.
     * Fetch limits: None
     */
    recommendations?: Relationship;
  }
  /**
   * The relationships for a playlist object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/playlist/relationships
   */
  interface PlaylistRelationships {
    /**
     * The curator that created the playlist. By default, curator includes identifiers only.
     * Fetch limits: None
     */
    curator?: CuratorRelationship;

    /**
     * The songs and music videos included in the playlist. By default, tracks includes objects.
     * Fetch limits: 100 default, 300 maximum
     */
    tracks?: TrackRelationship;
  }

  /**
   * The relationships for an artist object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/artist/relationships
   */
  interface ArtistRelationships {
    /**
     * The albums associated with the artist. By default, albums includes identifiers only.
     * Fetch limits: 25 default, 100 maximum
     */
    albums?: AlbumRelationship;

    /**
     * The genres associated with the artist. By default, genres is not included.
     * Fetch limits: None
     */
    genres?: GenreRelationship;

    /**
     * The music videos associated with the artist. By default, musicVideos is not included.
     * Fetch limits: 25 default, 100 maximum
     */
    musicVideos?: MusicVideoRelationship;

    /**
     * The playlists associated with the artist. By default, playlists is not included.
     * Fetch limits: 10 default, 10 maximum
     */
    playlists?: PlaylistRelationship;

    /**
     * The station associated with the artist. By default, station is not included.
     * Fetch limits: None (one station)
     */
    station?: StationRelationship;
  }

  /**
   * The relationships for a song object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/song/relationships
   */
  interface SongRelationships {
    /**
     * The albums associated with the song. By default, albums includes identifiers only.
     * Fetch limits: 10 default, 10 maximum
     */
    albums?: AlbumRelationship;

    /**
     * The artists associated with the song. By default, artists includes identifiers only.
     * Fetch limits: 10 default, 10 maximum
     */
    artists?: ArtistRelationship;

    /**
     * The genres associated with the song. By default, genres is not included.
     * Fetch limits: None
     */
    genres?: GenreRelationship;

    /**
     * The station associated with the song. By default, station is not included.
     * Fetch limits: None (one station)
     */
    station?: StationRelationship;
  }

  /**
   * The relationships for a library artist object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/libraryartist/relationships
   */
  interface LibraryArtistRelationships {
    /**
     * The library albums associated with the artist.
     * By default, albums is not included. It is available only when fetching a single library artist resource by ID.
     * Fetch limits: 25 default, 100 maximum
     */
    albums?: LibraryAlbumRelationship;
  }

  /**
   * The relationships for a library song object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/librarysong/relationships
   */
  interface LibrarySongRelationships {
    /**
     * The library albums associated with the song. By default, albums is not included.
     * Fetch limits: 10 default, 10 maximum
     */
    albums?: LibraryAlbumRelationship;

    /**
     * The library artists associated with the song. By default, artists is not included.
     * Fetch limits: 10 default, 10 maximum
     */
    artists?: LibraryArtistRelationship;
  }

  /**
   * The relationships for a library playlist object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/libraryplaylist/relationships
   */
  interface LibraryPlaylistRelationships {
    /**
     * The library songs and library music videos included in the playlist.
     * By default, tracks is not included. Only available when fetching a single library playlist resource by ID.
     * Fetch limits: 100 default, 100 maximum
     */
    tracks?: LibraryTrackRelationship;
  }

  /**
   * An object that represents the album relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/albumrelationship
   */
  interface AlbumRelationship extends Relationship {
    /**
     * (Required) The data for the album included in the relationship.
     */
    data: [Album];
  }

  /**
   * An object that represents the artist relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/artistrelationship
   */
  interface ArtistRelationship extends Relationship {
    /**
     * (Required) The data for the artist included in the relationship.
     */
    data: [Artist];
  }

  /**
   * An object that represents the track relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/trackrelationship
   */
  interface TrackRelationship extends Relationship {
    /**
     * (Required) The data for the track included in the relationship.
     */
    data: [Song];
  }

  interface GenreRelationship extends Relationship {
    data: [Genre];
  }

  interface CuratorRelationship extends Relationship {}

  interface MusicVideoRelationship extends Relationship {}

  /**
   * An object that represents the playlist relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/playlistrelationship
   */
  interface PlaylistRelationship {
    /**
     * (Required) The data for the playlist included in the relationship.
     */
    data: [Playlist];
  }

  /**
   * An object that represents the library artist relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/libraryartistrelationship
   */
  interface LibraryArtistRelationship extends Relationship {
    /**
     * (Required) The data for the library artist included in the relationship.
     */
    data: LibraryArtist[];
  }

  interface LibraryAlbumRelationship extends Relationship {
    /**
     * (Required) The data for the library album included in the relationship.
     */
    data: LibraryAlbum[];
  }

  interface LibraryTrackRelationship extends Relationship {
    /**
     * (Required) The data for the library track included in the relationship.
     */
    data: LibrarySong[];
  }

  interface StationRelationship {}
}
