export interface Artist {
  id: string;
  name: string;
  artwork: string;
  url: string;
}

enum CollectionType {
  album = 'albums',
  playlist = 'playlists'
}

export interface Collection {
  id: string;
  attributes: any;
  type: CollectionType;
}
