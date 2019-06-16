import {
  Song,
  CollectionType,
  Collection,
  Nullable,
  SnackbarMode,
  ThemeOption,
  ShuffleMode,
  SongSourceInfo
} from '@/@types/model/model';
import { RepeatMode, ButtonStyle, PlaybackBitrate } from '@/utils/constants';

// MusicPlayer module
export interface MusicPlayerState {
  currentPlaying: MusicKit.MediaItem | null;
  isPlaying: boolean;
  playbackProgress: number;
  isLoading: boolean;
  currentPlaybackTimeInMilliSeconds: number;
  repeatMode: RepeatMode;
  volume: number;
  isMuted: boolean;
  currentPlaybackTimeAfterSkip: number;
  shuffleMode: ShuffleMode;
  minimized: boolean;
}

// Payload
export type SkipToSongAtIndexPayload = {
  index: number;
};

export type PlaySongsPayload = {
  shuffle?: boolean;
  songs: Song[];
  sourceInfo: SongSourceInfo;
  // id of the starting song
  startPosition?: number;
};

export type FetchCollectionPayload = {
  collectionId: string;
  collectionType: CollectionType;
};

// Action
export type PlayCollectionAction = (
  payload: PlayCollectionPayload
) => Promise<void>;
export type AddToLibraryAction = (
  payload: AddToLibraryPayload
) => Promise<void>;

export type AppendSongsAction = (payload: AppendSongsPayload) => void;

export type PrependSongsAction = (payload: PrependSongsPayload) => void;

export type SkipToSongAtIndexAction = (
  payload: SkipToSongAtIndexPayload
) => void;

export type PlaySongsAction = (payload: PlaySongsPayload) => Promise<void>;

export type PlayCollectionPayload = {
  collectionId: string;
  collectionType:
    | 'albums'
    | 'playlists'
    | 'library-albums'
    | 'library-playlists';
  startPosition?: number;
  shuffle?: boolean;
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
  playbackBitrate: PlaybackBitrate;
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
  items: MusicKit.MediaItem[];
};

export type PrependSongsPayload = {
  items: MusicKit.MediaItem[];
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
  queue: MusicKit.Queue | null;
}

export type MoveNextPlayQueuePayload = {
  forceSkip: boolean;
};

/**
 * New Playlist Dialog state
 */
export interface NewPlaylistDialogState {
  visibility: boolean;
  itemsToAdd?: (Song | MusicKit.MediaItem)[];
}

export type OpenNewPlaylistDialogPayload = {
  itemsToAdd?: (Song | MusicKit.MediaItem)[];
};

export type OpenNewPlaylistDialogAction = (
  payload?: OpenNewPlaylistDialogPayload
) => void;

/**
 * Theme Editor Dialog
 */
export interface ThemeEditorDialogState {
  visibility: boolean;
  themeToEdit?: ThemeOption;
}

export type OpenThemeEditorDialogPayload = {
  themeToEdit?: ThemeOption;
};

export type OpenThemeEditorDialogAction = (
  payload?: OpenThemeEditorDialogPayload
) => void;

/**
 *
 */
export interface MediaActionMenuState {
  visibility: boolean;
  posX: number;
  posY: number;
  item?: Collection | Song | MusicKit.MediaItem;
  isQueue: boolean;
}

export type ShowMediaActionMenuPayload = {
  posX: number;
  posY: number;
  item: Collection | Song | MusicKit.MediaItem;
  isQueue: boolean;
};

export type ShowMediaActionMenuAction = (
  payload: ShowMediaActionMenuPayload
) => void;
