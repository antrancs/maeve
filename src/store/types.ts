export interface MusicPlayerState {
  currentPlaying: MusicKit.MediaItem | null;
  isPlaying: boolean;
  playbackProgress: number;
}

export type PlayCollectionAction = (
  payload: PlayCollectionAtIndexPayload
) => void;

export type PlayCollectionAtIndexPayload = {
  collectionId: string;
  collectionType: string;
  index: number;
};
