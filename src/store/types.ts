import { Nullable } from '@/@types/model/model';

// MusicPlayer module
export interface MusicPlayerState {
  currentPlaying: MusicKit.MediaItem | null;
  isPlaying: boolean;
  playbackProgress: number;
  queuedSongs: MusicKit.MediaItem[];
  isLoading: boolean;
  currentPlaybackTimeInMilliSeconds: number;
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

export type PlayCollectionAtIndexPayload = {
  playParams: MusicKit.PlayParameters;
  index: number;
};

export type PlayCollectionWithSongPayload = {
  playParams: MusicKit.PlayParameters;
  songId?: string;
};

export type SkipToSongAtIndexPayload = {
  index: number;
};

export type PlaySongsPayload = {
  ids: string[];
};

// Action
export type AddToLibraryAction = (
  payload: AddToLibraryPayload
) => Promise<void>;

export type AppendSongsAction = (payload: AppendSongsPayload) => void;

export type PrependSongsAction = (payload: PrependSongsPayload) => void;

export type PlayCollectionAtIndexAction = (
  payload: PlayCollectionAtIndexPayload
) => void;

export type PlayCollectionWithSongAction = (
  payload: PlayCollectionWithSongPayload
) => void;

export type SkipToSongAtIndexAction = (
  payload: SkipToSongAtIndexPayload
) => void;

export type PlaySongsAction = (payload: PlaySongsPayload) => void;

// Auth module
export interface AuthState {
  musicUserToken: string | null;
}

export interface SongQueueState {
  visibility: boolean;
}
