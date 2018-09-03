class LinkedListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class SongQueue {
  constructor(songs = []) {
    this.head = null;
    this.tail = null;
    this.songMap = {};
    songs.forEach(song => this.addSong(song));
  }

  addSong(song) {
    const songNode = new LinkedListNode(song.id, song);
    this.addLast(songNode);
    this.songMap[song.id] = songNode;
  }

  addSongs(songs) {
    songs.forEach(song => {
      this.addSong(song);
    });
  }

  /* eslint no-param-reassign: ["error", { "props": false }] */
  addLast(song) {
    if (!this.tail) {
      this.head = song;
      this.tail = song;
    } else {
      song.prev = this.tail;
      this.tail.next = song;
      this.tail = song;
    }
  }

  containsSong(songId) {
    return this.songMap[songId] !== undefined;
  }

  getNext(songId) {
    const songNode = this.songMap[songId];
    if (!songNode) {
      return null;
    }
    if (songNode === this.tail) {
      return null;
    }

    return songNode.next.value;
  }
}

export default SongQueue;
