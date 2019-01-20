declare namespace MusicKit {
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

    userStorefrontId: string;

    /**
     * Fetch one or more activites using their identifiers.
     * @param ids An array of activity identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns An array of activity resources.
     */
    activities(
      ids: string[],
      parameters?: QueryParameters
    ): Promise<Activity[]>;

    /**
     * Fetch an activity using its identifier.
     * @param id An activity identifier.
     * @param parameters A query params object that is serialized and passed directly to the Apple Music API.
     * @returns An activity resource.
     */
    activity(id: string, parameters?: QueryParameters): Promise<Activity>;

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

    charts(
      types: string[],
      parameters?: QueryParameters
    ): Promise<ChartResponse>;

    genre(id: string, parameters?: QueryParameters): Promise<any>;

    /**
     * Fetch an artist using its identifier.
     * @param id A playlist identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns An array of playlist resources.
     */
    playlist(id: string, parameters: QueryParameters): Promise<Playlist>;

    /**
     *
     * @param ids An array of playlist identifiers.
     * @param parameter A query parameters object that is serialized and passed directly to the Apple Music API.
     */
    playlists(ids: string[], parameter?: QueryParameters): Promise<Playlist[]>;

    /**
     * Fetch the recently played resources for the user.
     * https://developer.apple.com/documentation/musickitjs/musickit/api/3001453-recentplayed
     * @param parameter A query parameters object that is serialized and passed directly to the Apple Music API.
     */
    recentPlayed(
      parameter?: QueryParameters
    ): Promise<(Album | Playlist | Station)[]>;

    /**
     * Search the catalog using a query.
     * @param term The term to search.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     */
    search(term: string, parameters: QueryParameters): Promise<SearchResult>;

    songs(ids: string[], parameters?: QueryParameters): Promise<Song[]>;

    /**
     * Fetch a storefront using its identifier.
     * @param id A storefront identifier.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns A storefront resource.
     */
    storefront(id: string, parameters: QueryParameters): Promise<any>;

    /**
     * Fetch one or more recommendations using their identifiers.
     * @param ids An array of recommendation identifiers.
     * @param parameters A query parameters object that is serialized and passed directly to the Apple Music API.
     * @returns An array of recommendation resources.
     */
    recommendations(
      ids?: string[],
      parameter?: QueryParameters
    ): Promise<Recommendation[]>;

    /**
     * https://developer.apple.com/documentation/musickitjs/musickit/api/3001454-recommendation
     * @param id A recommendation identifier.
     * @param parameter A query parameters object that is serialized and passed directly to the Apple Music API.
     */
    recommendation(
      id: string,
      parameter?: QueryParameters
    ): Promise<Recommendation>;
  }
}
