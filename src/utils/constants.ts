export enum ActivityType {
  Workout = '976439525',
  Party = '976439514',
  Chill = '976439503',
  Romance = '976439518',
  Motivation = '1142652615',
  Focus = '976439521',
  Sad = '976439500',
  Decade = '1142652618'
}

export const activityIds = Object.keys(ActivityType).map(
  key => ActivityType[key as any]
);
