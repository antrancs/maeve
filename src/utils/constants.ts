export enum ActivityType {
  Workout = '976439525',
  Party = '976439514',
  Chill = '976439503',
  Romance = '976439518',
  Motivation = '1142652615',
  Sleep = '1442122106',
  Focus = '976439521',
  Sad = '976439500',
  Decade = '1142652618'
}

export const activityIds = Object.keys(ActivityType).map(
  key => ActivityType[key as any]
);

export type Genre = {
  id: string;
  name: string;
  colors: string[];
  curatorId: string;
};

export const GENRES: Genre[] = [
  {
    id: '14',
    name: 'Pop',
    colors: ['#f7797d', '#FBD786', '#C6FFDD'],
    curatorId: '976439548'
  },
  {
    id: '15',
    name: 'R&B/Soul',
    colors: ['#ad5389', '#3c1053'],
    curatorId: '976439551'
  },
  {
    id: '17',
    name: 'Dance',
    colors: ['#00c3ff', '#ffff1c'],
    curatorId: '976439535'
  },
  {
    id: '20',
    name: 'Alternative',
    colors: ['#34e89e', '#0f3443'],
    curatorId: '976439526'
  },
  {
    id: '18',
    name: 'Hiphop/Rap',
    colors: ['#ff6e7f', '#bfe9ff'],
    curatorId: '976439539'
  },
  {
    id: '21',
    name: 'Rock',
    colors: ['#8A2387', '#E94057', '#3b8d99'],
    curatorId: '976439554'
  },
  {
    id: '7',
    name: 'Electronic',
    colors: ['#A770EF', '#CF8BF3', '#FDB99B'],
    curatorId: '976439536'
  },
  {
    id: '11',
    name: 'Jazz',
    colors: ['#3a6186', '#89253e'],
    curatorId: '976439542'
  },
  {
    id: '5',
    name: 'Classical',
    colors: ['#0F2027', '#203A43', '#2c5364'],
    curatorId: '976439532'
  }
];

export enum RepeatMode {
  Off = 0,
  All = 1,
  One = 2
}

export enum ButtonStyle {
  normal = 'normal',
  round = 'round'
}

export const PLACEHOLDER_IMAGE =
  'https://user-images.githubusercontent.com/14043840/50736349-e11feb00-11bc-11e9-84d9-20dc9652ef5b.jpeg';
