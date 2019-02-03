export type Nullable<T> = T | null | undefined;

// export interface Artist {
//   id: string;
//   name: string;
//   artwork: string;
//   url: string;
// }

export enum CollectionType {
  album = 'albums',
  playlist = 'playlists',
  libraryPlaylist = 'library-playlists',
  libraryAlbum = 'library-albums'
}

export type CatalogCollection = MusicKit.Album | MusicKit.Playlist;
export type LibraryCollection =
  | MusicKit.LibraryAlbum
  | MusicKit.LibraryPlaylist;

export type Collection =
  | MusicKit.Album
  | MusicKit.Playlist
  | MusicKit.LibraryAlbum
  | MusicKit.LibraryPlaylist;

export type Album = MusicKit.Album | MusicKit.LibraryAlbum;

export type LastfmSong = MusicKit.Song & {
  lastStream: string;
};

export type Song = MusicKit.Song | MusicKit.LibrarySong | LastfmSong;

export type Artist = MusicKit.Artist | MusicKit.LibraryArtist;

export type Playlist = MusicKit.Playlist | MusicKit.LibraryPlaylist;

export enum SnackbarMode {
  success = 'success',
  error = 'error'
}

// Methods
export type HandleSongClicked = (index: number, songId: string) => void;

export interface ThemeOption {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  primaryText: string;
  secondaryText: string;
  editable: boolean;
}
