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
  collectionId: string;
  collectionType: MusicKit.Kind;
  index: number;
};

// Auth module
export interface AuthState {
  musicUserToken: string | null;
}
