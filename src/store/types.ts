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
  collectionType: string;
  index: number;
};

export type AppendSongsPayload = {
  items: MusicKit.MediaItem[];
};

export type AddToLibraryPayload = {
  itemIds: string[];
  type: string;
};

// Auth module
export interface AuthState {
  musicUserToken: string | null;
}

// Context menu
export interface ContextMenuState {
  selectedTrack: MusicKit.MediaItem | null;
  isContextMenuShowing: boolean;
  displayPositionPageX: number;
  displayPositionPageY: number;
}
export type ToggleContextMenuPayload = {
  pageX: number;
  pageY: number;
  selectedTrack: MusicKit.MediaItem;
};
