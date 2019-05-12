export type Nullable<T> = T | null | undefined;

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

// export type PlayQueueSong = {
//   // qId is the unique id of the song in the queue. We can't rely on the song id
//   // as the unique identifier as it's possible to add the same song to the queue
//   qId: string;
// } & Song;

export type Artist = MusicKit.Artist | MusicKit.LibraryArtist;

export type Playlist = MusicKit.Playlist | MusicKit.LibraryPlaylist;

export enum SnackbarMode {
  success = 'success',
  error = 'error'
}

export enum ShuffleMode {
  Off = 0,
  On = 1
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

export type GenreItem = {
  name: string;
  id: string;
  colors: string[];
};

export type SongSourceInfo = {
  name: String;
  path: {
    name: String;
    params?: Object;
    query?: Object;
  };
};
