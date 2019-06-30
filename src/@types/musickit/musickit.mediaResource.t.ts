declare namespace MusicKit {
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
    attributes?: object;
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
    relationships?: object;

    /**
     * (Required) The type of resource.
     */
    type: string;
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
    type: 'albums';
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
    type: 'artists';
  }

  interface Chart extends Resource {
    chart: string;
    data: Resource[];
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
    type: 'songs';
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
    movementCount?: number;

    /**
     * (Classical music only) The movement name of this song.
     */
    movementName?: string;

    /**
     * (Classical music only) The movement number of this song.
     */
    movementNumber?: number;

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

    additionalInfo?: any;
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
    type: 'playlists';
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
   * The attributes for a genre object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/genre/attributes
   */
  interface GenreAttributes {
    /**
     * (Required) The localized name of the genre.
     */
    name: string;
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
    title: {
      stringForDisplay: string;
    };
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
    type: 'library-albums';
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
   * An object that represents the library artist relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/libraryartistrelationship
   */
  interface LibraryArtistRelationship extends Relationship {
    /**
     * (Required) The data for the library artist included in the relationship.
     */
    data: LibraryArtist[];
  }

  interface LibraryTrackRelationship extends Relationship {
    /**
     * (Required) The data for the library track included in the relationship.
     */
    data: LibrarySong[];
  }

  /**
   * An object that represents the track relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/trackrelationship
   */
  interface TrackRelationship extends Relationship {
    /**
     * (Required) The data for the track included in the relationship.
     */
    data: Song[];
  }

  interface GenreRelationship extends Relationship {
    data: Genre[];
  }

  /**
   * An object that represents the curator relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/curatorrelationship?changes=_9
   */
  interface CuratorRelationship extends Relationship {
    /**
     * (Required) The data for the curator included in the relationship.
     */
    data: [Curator];
  }

  /**
   * An object that represents the music video relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/musicvideorelationship?changes=_9
   */
  interface MusicVideoRelationship extends Relationship {
    /**
     * (Required) The data for the music video included in the relationship.
     */
    data: [MusicVideo];
  }

  /**
   * An object that represents the playlist relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/playlistrelationship
   */
  interface PlaylistRelationship {
    /**
     * (Required) The data for the playlist included in the relationship.
     */
    data: Playlist[];
  }

  interface LibraryAlbumRelationship extends Relationship {
    /**
     * (Required) The data for the library album included in the relationship.
     */
    data: LibraryAlbum[];
  }

  /**
   * An object that represents the station relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/stationrelationship?changes=_9
   */
  interface StationRelationship extends Relationship {
    data: [Station];
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
    type: 'library-songs';
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
    type: 'library-playlists';
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
    description?: MusicKit.EditorialNotes;

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

  /**
   * The attributes for an activity object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/activity/attributes
   */
  interface ActivityAttributes {
    /**
     * (Required) The activity artwork.
     */
    artwork: Artwork;

    /**
     * The notes about the activity that appear in the iTunes Store.
     */
    editorialNotes?: EditorialNotes;

    /**
     * (Required) The localized name of the activity.
     */
    name: string;

    /**
     * (Required) The URL for sharing an activity in the iTunes Store.
     */
    url: string;
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
    type: 'library-artists';
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
   * The relationships for an activity object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/activity/relationships
   */
  interface ActivityRelationships {
    /**
     * The playlists associated with this activity. By default, playlists includes identifiers only.
     * Fetch limits: 10 default, 10 maximum
     */
    playlists?: PlaylistRelationship;
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
    data: Album[];
  }

  /**
   * An object that represents the artist relationship for a Resource object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/artistrelationship
   */
  interface ArtistRelationship extends Relationship {
    /**
     * (Required) The data for the artist included in the relationship.
     */
    data: Artist[];
  }

  /**
   * A Resource object that represents a station.
   * Ref: https://developer.apple.com/documentation/applemusicapi/station?changes=_9
   */
  interface Station extends Resource {
    attributes?: StationAttributes;
    type: 'stations';
  }

  /**
   * The attributes for a station object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/station/attributes?changes=_9
   */
  interface StationAttributes {
    /**
     * (Required) The radio station artwork.
     */
    artwork: Artwork;

    /**
     * The duration of the stream. This value is not emitted for 'live' or programmed stations.
     */
    durationInMillis?: number;

    /**
     * The notes about the station that appear in Apple Music.
     */
    editorialNotes?: EditorialNotes;

    /**
     * The episode number of the station. This value is emitted when the station
     * represents an episode of a show or other content.
     */
    episodeNumber?: number;

    /**
     * (Required) Whether the station is a live stream.
     */
    isLive: boolean;

    /**
     * (Required) The localized name of the station.
     */
    name: string;

    /**
     * (Required) The URL for sharing a station in Apple Music.
     */
    url: string;
  }

  /**
   * A Resource object that represents a music video.
   * Ref: https://developer.apple.com/documentation/applemusicapi/musicvideo?changes=_9
   */
  interface MusicVideo extends Resource {
    /**
     * The attributes for the music video.
     */
    attributes: MusicVideoAttributes;

    /**
     * The relationships for the music video.
     */
    relationships: MusicVideoRelationships;

    /**
     * (Required) This value will always be musicVideos.
     */
    type: string;
  }

  interface MusicVideoAttributes {
    /**
     * The name of the album the music video appears on.
     */
    albumName?: string;

    /**
     * (Required) The artist’s name.
     */
    artistName: string;

    /**
     * (Required) The artwork for the music video’s associated album.
     */
    artwork: Artwork;

    /**
     * The Recording Industry Association of America (RIAA) rating of the content.
     * The possible values for this rating are clean and explicit. No value means no rating.
     */
    contentRating?: string;

    /**
     * The duration of the music video in milliseconds.
     */
    durationInMillis?: number;

    /**
     * The editorial notes for the music video.
     */
    editorialNotes?: EditorialNotes;

    /**
     * (Required) The music video’s associated genres.
     */
    genreNames: [string];

    /**
     * (Required) The International Standard Recording Code (ISRC) for the music video.
     */
    isrc: string;

    /**
     * (Required) The localized name of the music video.
     */
    name: string;

    /**
     * The parameters to use to play back the music video.
     */
    playParams?: PlayParameters;

    /**
     * (Required) The preview assets for the music video.
     */
    previews: [Preview];

    /**
     * (Required) The release date of the music video in YYYY-MM-DD format.
     */
    releaseDate: Date;

    /**
     * The number of the music video in the album’s track list.
     */
    trackNumber?: number;

    /**
     * (Required) A URL for sharing the music video.
     */
    url: string;

    /**
     * The video subtype associated with the content.
     */
    videoSubType?: string;

    /**
     * (Required) Whether the music video has HDR10-encoded content.
     */
    hasHDR: boolean;

    /**
     * (Required) Whether the music video has 4K content.
     */
    has4K: boolean;
  }

  /**
   * The relationships for a music video object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/musicvideo/relationships?changes=_9
   */
  interface MusicVideoRelationships {
    /**
     * The albums associated with the music video. By default, albums includes identifiers only.
     * Fetch limits: 10 default, 10 maximum
     */
    albums?: AlbumRelationship;

    /**
     * The artists associated with the music video. By default, artists includes identifiers only.
     * Fetch limits: 10 default, 10 maximum
     */
    artists?: ArtistRelationship;

    /**
     * The genres associated with the music video. By default, genres is not included.
     * Fetch limits: None
     */
    genres?: GenreRelationship;
  }

  /**
   * A Resource object that represents a curator of resources.
   * Ref: https://developer.apple.com/documentation/applemusicapi/curator?changes=_9
   */
  interface Curator extends Resource {
    /**
     * The attributes for the curator.
     */
    attributes?: CuratorAttributes;

    /**
     * The relationships for the curator.
     */
    relationships: CuratorRelationships;

    /**
     * (Required) This value will always be curators.
     */
    type: 'curators';
  }

  /**
   * The attributes for a curator object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/curator/attributes?changes=_9
   */
  interface CuratorAttributes {
    /**
     * (Required) The curator artwork.
     */
    artwork: Artwork;

    /**
     * The notes about the curator.
     */
    editorialNotes?: EditorialNotes;

    /**
     * (Required) The localized name of the curator.
     */
    name: string;

    /**
     * (Required) The URL for sharing a curator in Apple Music.
     */
    url: string;
  }

  /**
   * The relationships for a curator object.
   * Ref: https://developer.apple.com/documentation/applemusicapi/curator/relationships?changes=_9
   */
  interface CuratorRelationships {
    /**
     * The playlists associated with the curator. By default, playlists includes identifiers only.
     * Fetch limits: 10 default, 10 maximum
     */
    playlists: PlaylistRelationship;
  }

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

  interface Activity extends Resource {
    /**
     * The attributes for the activity.
     */
    attributes?: ActivityAttributes;

    /**
     * The relationships for the activity.
     */
    relationships?: ActivityRelationships;

    /**
     * (Required) Always activities.
     */
    type: 'activities';
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

    catalogId?: string;

    globalId?: string;
  }

  /**
   * The response to a chart request.
   * Ref: https://developer.apple.com/documentation/applemusicapi/chartresponse
   */
  interface ChartResponse {
    /**
     * The albums returned when fetching charts.
     */
    albums: Chart[];

    /**
     * The songs returned when fetching charts.
     */
    songs: Chart[];

    /**
     * The playlists returned when fetching charts.
     */
    playlists: Chart[];
  }

  /**
   * A Resource object that represents a chart, or a collection of the top songs,
   * albums, or other types of resources.
   * Ref: https://developer.apple.com/documentation/applemusicapi/chart
   */
  interface Chart {
    /**
     * The chart identifier.
     */
    chart: string;

    /**
 * An array of the requested objects, ordered by popularity. 
 * For example, if songs were specified as the chart type in the request, the array contains Song objects.
href
 */
    data: Resource[];

    /**
     * The URL for the chart.
     */
    href: string;

    /**
     * The localized name for the chart.
     */
    name: string;

    /**
     * The URL for the next page.
     */
    next?: string;
  }
}
