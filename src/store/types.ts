import {
  Song,
  CollectionType,
  Collection,
  Nullable,
  SnackbarMode
} from '@/@types/model/model';
import { RepeatMode } from '@/utils/constants';

// MusicPlayer module
export interface MusicPlayerState {
  currentPlaying: MusicKit.MediaItem | null;
  isPlaying: boolean;
  playbackProgress: number;
  isLoading: boolean;
  currentPlaybackTimeInMilliSeconds: number;
  repeatMode: RepeatMode;
  volume: number;
}

// Payload
export type AppendSongsPayload = {
  items: MusicKit.MediaItem[];
};

export type PrependSongsPayload = {
  items: MusicKit.MediaItem[];
};

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

export type PlayCollectionWithSongPayload = {
  collection: Collection;
  shuffle?: boolean;
  songId?: string;
};

export type SkipToSongAtIndexPayload = {
  index: number;
};

export type PlaySongsPayload = {
  songIds: string[];
  startSongIndex: number;
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

export type FetchCollectionAction = (payload: FetchCollectionPayload) => void;

export type PlayCollectionPayload = {
  collection: Collection;
};

export type AddSongsToPlaylistAction = (
  payload: AddSongsToPlaylistPayload
) => Promise<any>;

export type CreateNewPlaylistAction = (
  payload: CreateNewPlaylistPayload
) => Promise<any>;

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
}

export interface UserLibraryState {
  albums: MusicKit.LibraryAlbum[];
  playlists: MusicKit.LibraryPlaylist[];
  songs: MusicKit.LibrarySong[];
}

export interface SnackbarState {
  visibility: boolean;
  text: string;
  timeout: number;
  type: string;
}

export type ShowSnackbarAction = (payload: ShowSnackbarActionPayload) => void;

export interface ShowSnackbarActionPayload {
  text: string;
  timeout?: number;
  type?: SnackbarMode;
}
