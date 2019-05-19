import random from 'lodash/random';

import { Collection, Song, Nullable } from '@/@types/model/model';
import { isLight, TEXT_PRIMARY_DARK, TEXT_PRIMARY_LIGHT } from '@/themes';

const bgColors = [
  ['#556270', '#4ECDC4'],
  ['#114357', '#F29492'],
  ['#525252', '#3d72b4'],
  ['#514A9D', '#24C6DC']
]; // used when the artwork doesn't have bgColor properties

const getArtworkUrl = (
  originalUrl: string,
  width: number,
  height: number
): string => {
  if (!originalUrl) {
    return '';
  }

  const replace: { [key: string]: string } = {
    '{w}': width.toString(),
    '{h}': height.toString(),
    'bb.jpeg': 'sr.jpeg'
  };

  return originalUrl.replace(/{w}|{h}|bb.jpeg/gi, matched => {
    return replace[matched].toString();
  });
};

const getArtworkSize = (screenSize: string) => {
  switch (screenSize) {
    case 'xl':
      return 300;
    case 'lg':
      return 210;
    case 'md':
      return 230;
    case 'sm':
      return 210;
    default:
      return 190;
  }
};

const formatArtworkUrl = (
  artworkUrl: string,
  width: number,
  height: number
) => {
  if (!artworkUrl || artworkUrl.length === 0) {
    return '';
  }
  return `${artworkUrl.substring(
    0,
    artworkUrl.lastIndexOf('/') + 1
  )}${width}x${height}bb.jpg`;
};

const getSongsFromCollection = (collection: Nullable<Collection>): Song[] => {
  if (
    !collection ||
    !collection.relationships ||
    !collection.relationships.tracks
  ) {
    return [];
  }
  return collection.relationships.tracks.data;
};

const hexToRgb = (hex: string) => {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b];
};

const getTextColorForBackground = (bgColor: string) => {
  return isLight(bgColor) ? TEXT_PRIMARY_LIGHT : TEXT_PRIMARY_DARK;
};

// return 2 colors for gradient background color based on the given artwork
const getGradientBackgroundColorsFromArtwork = (artwork: MusicKit.Artwork) => {
  const { bgColor, textColor1, textColor2, textColor3, textColor4 } = artwork;

  if (!bgColor) {
    const bgColorIndex = random(0, bgColors.length - 1);

    return bgColors[bgColorIndex];
  }
  if (isLight(bgColor)) {
    const firstColor = textColor1 || '000000';
    const secondColor = textColor3 || textColor2 || '000000';

    return [`#${firstColor}`, `#${secondColor}`];
  }

  const secondColor = textColor2 || textColor1 || '000000';
  return [`#${bgColor}`, `#${secondColor}`];
};

export {
  getArtworkUrl,
  formatArtworkUrl,
  getSongsFromCollection,
  getArtworkSize,
  hexToRgb,
  getTextColorForBackground,
  getGradientBackgroundColorsFromArtwork
};
