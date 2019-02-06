import {
  Song,
  CollectionType,
  Collection,
  Nullable,
  SnackbarMode,
  ThemeOption,
  CatalogCollection,
  LibraryCollection
} from '@/@types/model/model';
import { RepeatMode, ButtonStyle } from '@/utils/constants';

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
}

// Payload
export type AppendSongsPayload = {
  items: MusicKit.MediaItem[];
};

export type PrependSongsPayload = {
  items: MusicKit.MediaItem[];
};

export type PlayCollectionWithSongPayload = {
  collection: Collection;
  shuffle?: boolean;
  songId?: string;
  songs?: MusicKit.Song[];
};

export type SkipToSongAtIndexPayload = {
  index: number;
};

export type PlaySongsPayload = {
  songs: Song[];
  startSongIndex: number;
  shuffle?: boolean;
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

export type PlayCollectionWithSongAction = (
  payload: PlayCollectionWithSongPayload
) => void;

export type SkipToSongAtIndexAction = (
  payload: SkipToSongAtIndexPayload
) => void;

export type PlaySongsAction = (payload: PlaySongsPayload) => void;

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
}

// Auth module
export interface AuthState {
  musicUserToken: string | null;
}

export interface PlayQueueState {
  visibility: boolean;
  songs: MusicKit.MediaItem[];
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
export type FetchOnePlaylistLibraryaAction = (
  id: string
) => Promise<MusicKit.LibraryPlaylist>;

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

/**
 * Lastfm module
 */
export type ScobbleLastfmActionPayload = {
  artist: string;
  track: string;
};

export type ScobbleLastfmAction = (
  payload: ScobbleLastfmActionPayload
) => Promise<void>;

export type SaveTokenLastfmAction = (token: Nullable<string>) => void;
