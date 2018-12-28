export type Nullable<T> = T | null | undefined;

export interface Artist {
  id: string;
  name: string;
  artwork: string;
  url: string;
}

export enum CollectionType {
  album = 'albums',
  playlist = 'playlists',
  libraryPlaylist = 'library-playlists',
  libraryAlbum = 'library-albums'
}

export type Collection =
  | MusicKit.Album
  | MusicKit.Playlist
  | MusicKit.LibraryAlbum
  | MusicKit.LibraryPlaylist;

export type Song = MusicKit.Song | MusicKit.LibrarySong;

export enum SnackbarMode {
  success = 'success',
  error = 'error'
}

// Methods
export type HandleSongClicked = (index: number, songId: string) => void;
