export interface MusicPlayerState {
  currentPlaying: MusicKit.MediaItem | null;
  isPlaying: boolean;
  playbackProgress: number;
}

export type PlayCollectionAtIndexAction = (
  payload: PlayCollectionAtIndexPayload
) => void;

export type PlayCollectionAtIndexPayload = {
  collectionId: string;
  collectionType: MusicKit.Kind;
  index: number;
};
