export const albumsResource: MusicKit.Album[] = [
  {
    id: '1',
    type: 'albums',
    attributes: {
      artistName: 'NF',
      albumName: 'Perception',
      genreNames: ['Hip-Hop', 'Rap'],
      isComplete: true,
      isSingle: false,
      name: 'Perception',
      recordLabel: 'NF Real Music',
      releaseDate: new Date('2017-10-06'),
      trackCount: 16,
      url: 'https://itunes.apple.com/us/album/perception/1276828373',
      isMasteredForItunes: false
    }
  },
  {
    id: '2',
    type: 'albums',
    attributes: {
      artistName: 'NF',
      albumName: 'Therapy Session',
      genreNames: ['Hip-Hop', 'Rap'],
      isComplete: true,
      isSingle: false,
      name: 'Therapy Session',
      recordLabel: 'NF Real Music',
      releaseDate: new Date('2016-04-22'),
      trackCount: 14,
      url: 'https://itunes.apple.com/us/album/therapy-session/1099370193',
      isMasteredForItunes: false
    }
  }
];

export const artistsResource: MusicKit.Artist[] = [
  {
    id: '1233',
    type: 'artists',
    attributes: {
      name: 'NF',
      genreNames: ['Hip-Hop', 'Rap'],
      url: 'https://itunes.apple.com/us/artist/nf/898094630'
    }
  }
];

export const songsResource: MusicKit.Song[] = [
  {
    id: 's1',
    type: 'songs',
    attributes: {
      name: "You're special",
      genreNames: ['Hip-Hop'],
      url: '',
      albumName: 'Perception',
      artistName: 'NF',
      artwork: {
        url: '',
        width: 500,
        height: 500
      },
      discNumber: 1,
      isrc: 'NDJKKD',
      previews: [{ url: 'itunes.com' }],
      releaseDate: '01/01/2017',
      trackNumber: 5
    }
  }
];
