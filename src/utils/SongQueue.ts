interface Song {
  id: string;
  name: string;
  artistName: string;
  artwork: string;
}

class SongQueue {
  private head: LinkedListNode<Song> | null;
  private tail: LinkedListNode<Song> | null;
  private songMap: { [key: string]: LinkedListNode<Song> } = {};

  constructor(songs: Song[]) {
    this.head = null;
    this.tail = null;
    songs.forEach(song => this.addSong(song));
  }

  public addSong(song: Song) {
    const songNode = new LinkedListNode<Song>(song.id, song);
    this.addLast(songNode);
  }

  private addLast(song: LinkedListNode<Song>) {
    if (!this.tail) {
      this.head = song;
      this.tail = song;
    } else {
      song.prev = this.tail;
      this.tail.next = song;
      this.tail = song;
    }
  }

  containsSong(songId: string) {
    return this.songMap[songId] !== undefined;
  }

  getNext(songId: string): Song | null {
    const songNode = this.songMap[songId];
    if (!songNode) {
      return null;
    }

    if (songNode === this.tail) {
      return null;
    }

    return songNode.next!.value;
  }
}

class LinkedListNode<T> {
  key: String;
  value: T;
  next: LinkedListNode<T> | null;
  prev: LinkedListNode<T> | null;

  constructor(key: String, value: T) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export default SongQueue;
