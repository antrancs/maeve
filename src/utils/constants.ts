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
