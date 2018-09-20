// MusicPlayer module
export interface MusicPlayerState {
  currentPlaying: MusicKit.MediaItem | null;
  isPlaying: boolean;
  playbackProgress: number;
  queuedSongs: MusicKit.MediaItem[];
}

export type PlayCollectionAtIndexAction = (
  payload: PlayCollectionAtIndexPayload
) => void;

export type PlayCollectionAtIndexPayload = {
  playParams: MusicKit.PlayParameters;
  index: number;
};

export type AppendSongsAction = (payload: AppendSongsPayload) => void;
export type AppendSongsPayload = {
  items: MusicKit.MediaItem[];
};

export type AddToLibraryPayload = {
  itemIds: string[];
  type: string;
};
export type AddToLibraryAction = (payload: AddToLibraryPayload) => void;

// Auth module
export interface AuthState {
  musicUserToken: string | null;
}
