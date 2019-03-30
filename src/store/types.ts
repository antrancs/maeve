import {
  Song,
  CollectionType,
  Collection,
  Nullable,
  SnackbarMode,
  ThemeOption,
  PlayQueueSong,
  PlayQueueNextSongToPlay,
  ShuffleMode
} from '@/@types/model/model';
import { RepeatMode, ButtonStyle } from '@/utils/constants';

// MusicPlayer module
export interface MusicPlayerState {
  currentPlaying: PlayQueueSong | null;
  // name of the source where the currentPlaying is from ('Your Queue' or name of the album/playlists)
  currentPlayingSource: string;
  // currentCollectionId is the id of the collection to which currentPlaying belongs
  // currentCollectionId is null when currentPlaying is from a list of songs (for eg, top songs of an artist)
  currentCollectionId: string | null;
  currentCollectionType:
    | 'albums'
    | 'playlists'
    | 'library-albums'
    | 'library-playlists'
    | null;
  isPlaying: boolean;
  playbackProgress: number;
  isLoading: boolean;
  currentPlaybackTimeInMilliSeconds: number;
  repeatMode: RepeatMode;
  volume: number;
  isMuted: boolean;
  currentPlaybackTimeAfterSkip: number;
  shuffleMode: ShuffleMode;
}

export type PlayNextPayload = {
  forceSkip: boolean;
};

// Payload
export type SkipToSongAtIndexPayload = {
  index: number;
};

export type PlaySongsPayload = {
  shuffle?: boolean;
  songs: Song[];
  // name of the source where the songs are from (name of the album/playlist, Artist's top tracks...)
  songsSourceName: string;
  // id of the starting song
  startSongIndex?: number;
  // id of the collection from which 'songs' are from
  collectionId?: string;
  collectionType?:
    | 'albums'
    | 'playlists'
    | 'library-albums'
    | 'library-playlists';
};

export type FetchCollectionPayload = {
  collectionId: string;
  collectionType: CollectionType;
};

// Action
export type AddToLibraryAction = (
  payload: AddToLibraryPayload
) => Promise<void>;

export type AppendSongsAction = (payload: AppendSongsPayload) => void;

export type PrependSongsAction = (payload: PrependSongsPayload) => void;

// export type PlayCollectionWithSongAction = (
//   payload: PlayCollectionWithSongPayload
// ) => void;

export type SkipToSongAtIndexAction = (
  payload: SkipToSongAtIndexPayload
) => void;

export type PlaySongsAction = (payload: PlaySongsPayload) => Promise<void>;

export type BlockArtistsAction = (artistIds: string[]) => void;
export type UnblockArtistsAction = (artistIds: string[]) => void;

export type BlockSongAction = (songId: string) => void;
export type UnblockSongAction = (songId: string) => void;
// export type FetchCollectionAction = (payload: FetchCollectionPayload) => void;

export type PlayCollectionPayload = {
  collection: Collection;
};

export type AddSongsToPlaylistAction = (
  payload: AddSongsToPlaylistPayload
) => Promise<any>;

export type CreateNewPlaylistAction = (
  payload: CreateNewPlaylistPayload
) => Promise<any>;

export type ShowSnackbarAction = (payload: ShowSnackbarActionPayload) => void;

export interface ShowSnackbarActionPayload {
  text: string;
  timeout?: number;
  type?: SnackbarMode;
  action?: {
    text: string;
    handler: () => void;
  };
}

// Auth module
export interface AuthState {
  musicUserToken: string | null;
}

export interface CollectionState {
  collection: Nullable<Collection>;
  songs: Song[];
}

export interface CatalogState {}

export interface SnackbarState {
  visibility: boolean;
  text: string;
  timeout: number;
  type: string;
  action?: {
    text: string;
    handler: () => void;
  };
}

export interface LayoutState {
  showFooter: boolean;
}

/**
 * Settings module
 */
export interface SettingsState {
  defaultThemes: ThemeOption[];
  customThemes: ThemeOption[];
  selectedTheme: ThemeOption;
  buttonStyle: ButtonStyle;
  blockedArtists: {
    [id: string]: boolean;
  };
  blockedSongs: {
    [id: string]: boolean;
  };
}

export type CreateNewThemeActionPayload = {
  primary: string;
  secondary: string;
  accent: string;
  primaryText: string;
  secondaryText: string;
  name: string;
};

export type CreateNewThemeAction = (
  payload: CreateNewThemeActionPayload
) => void;

export type SetThemeMutationPayload = {
  id: string;
  theme: ThemeOption;
};

export type UpdateThemeActionPayload = {
  theme: ThemeOption;
};

export type UpdateThemeAction = (payload: UpdateThemeActionPayload) => void;

export type SelectThemeActionPayload = {
  theme: ThemeOption;
};

export type SelectThemeAction = (payload: SelectThemeActionPayload) => void;

/**
 * Catalog module
 */
export type FetchOneAlbumCatalogAction = (
  id: string
) => Promise<MusicKit.Album>;
export type FetchOnePlaylistCatalogAction = (
  id: string
) => Promise<MusicKit.Playlist>;
export type FetchMultiplePlaylistsCatalogAction = (
  ids: string[]
) => Promise<MusicKit.Playlist[]>;
export type FetchRecommendationsAction = () => Promise<
  MusicKit.Recommendation[]
>;
export type FetchRecentPlayedAction = () => Promise<
  (MusicKit.Album | MusicKit.Playlist | MusicKit.Station)[]
>;

export type FetchCuratorPlaylistsPayload = SearchParams & {
  id: string;
};

export type FetchCuratorPlaylistsAction = (
  payload: FetchCuratorPlaylistsPayload
) => Promise<FetchResult<MusicKit.Playlist>>;

export type SearchCatalogPayload = SearchParams & {
  term: string;
  type: 'albums' | 'playlists' | 'songs' | 'artists';
};

export type SearchCatalogAction = (
  payload: SearchCatalogPayload
) => Promise<
  FetchResult<
    MusicKit.Album | MusicKit.Playlist | MusicKit.Song | MusicKit.Artist
  >
>;

export type FetchMultipleArtitsCatalogAction = (
  ids: string[]
) => Promise<MusicKit.Artist[]>;

export type FetchMultipleSongsCatalogAction = (
  ids: string[]
) => Promise<MusicKit.Song[]>;

export type FetchActivityPlaylistsPayload = SearchParams & {
  id: string;
};

export type FetchActivityPlaylistsAction = (
  payload: FetchActivityPlaylistsPayload
) => Promise<FetchResult<MusicKit.Playlist>>;

/**
 * Library module
 */
export interface UserLibraryState {
  albums: MusicKit.LibraryAlbum[];
  playlists: MusicKit.LibraryPlaylist[];
  songs: MusicKit.LibrarySong[];
}

export type AddToLibraryPayload = {
  itemIds: string[];
  type: string;
};

export type AddSongsToPlaylistPayload = {
  songItems: { id: string; type: string }[];
  playlistId: string;
};

export type CreateNewPlaylistPayload = {
  name: string;
  description?: string;
  items?: { id: string; type: string }[];
};

export type FetchOneAlbumLibraryAction = (
  id: string
) => Promise<MusicKit.LibraryAlbum>;

export type FetchOnePlaylistLibraryAction = (
  id: string
) => Promise<MusicKit.LibraryPlaylist>;

export type FetchLibraryPlaylistTracksAction = (
  id: string
) => Promise<MusicKit.LibrarySong[]>;

export type FetchMultipleAlbumsCatalogAction = (
  ids: string[]
) => Promise<MusicKit.Album[]>;

export type SearchParams = {
  offset: number;
  limit: number;
};

export interface FetchResult<T> {
  hasNext: boolean;
  hasNoData: boolean;
  data: T[];
  offset?: number;
}
export type FetchLibraryAlbumsActions = (
  payload: SearchParams
) => Promise<FetchResult<MusicKit.LibraryAlbum>>;

export type FetchLibraryPlaylistsActions = (
  payload: SearchParams
) => Promise<FetchResult<MusicKit.LibraryPlaylist>>;

export type FetchLibrarySongsActions = (
  payload: SearchParams
) => Promise<FetchResult<MusicKit.LibrarySong>>;

export type FetchLibraryArtistssActions = (
  payload: SearchParams
) => Promise<FetchResult<MusicKit.LibraryArtist>>;

export type FetchAppleCuratorPlaylists = (
  id: string,
  params: SearchParams
) => Promise<FetchResult<MusicKit.Playlist>>;

export interface LastfmState {
  token: string;
}

export type FetchRecentlyAddedAction = () => Promise<
  (MusicKit.LibraryAlbum | MusicKit.LibraryPlaylist)[]
>;

/**
 * Lastfm module
 */
export type ScobbleLastfmActionPayload = {
  artist: string;
  track: string;
  album?: string;
};

export type ScobbleLastfmAction = (
  payload: ScobbleLastfmActionPayload
) => Promise<void>;

export type SaveTokenLastfmAction = (token: Nullable<string>) => void;

/**
 * PlayQueue module
 */
export type AppendSongsPayload = {
  items: PlayQueueSong[];
};

export type PrependSongsPayload = {
  items: PlayQueueSong[];
};

export type RemoveFromMainSongsActionPayload = {
  // index of the song to delete in the 'Up Next' list
  index: number;

  // the queue id of song to delete
  qId: string;
};

export type RemoveFromMainSongsAction = (
  payload: RemoveFromMainSongsActionPayload
) => void;

export type ChangeToIndexActionPayload = {
  index: number;
};

export type ChangeToIndexAction = (payload: ChangeToIndexActionPayload) => void;

export type SetSnackbarActionMutationPayload = {
  text: string;
  handler: () => void;
};

/**
 * PlayQueue module
 */
export interface PlayQueueState {
  visibility: boolean;
  // mainSongs are songs that we originally add to the play queue
  // (songs from an album/playlist/multiple individual songs)
  mainSongs: PlayQueueSong[];
  // name of the source where 'mainSongs' are from (name of an album/playlist, Artist's top tracks...)
  mainSongsSource: string;
  mainSongsIndex: number;
  nextSongToPlay: PlayQueueNextSongToPlay | undefined;
  shuffledMainSongs: PlayQueueSong[];
  shuffleSongIndex: number;
  queue: PlayQueueSong[];
}

export type MoveNextPlayQueuePayload = {
  forceSkip: boolean;
};
