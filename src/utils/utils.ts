import random from 'lodash/random';

import { Collection, Song, Nullable } from '@/@types/model/model';
import { isLight, TEXT_PRIMARY_DARK, TEXT_PRIMARY_LIGHT } from '@/themes';
import { PLACEHOLDER_IMAGE } from './constants';

const bgColors = [
  ['#4c5ea6', '#000000'],
  ['#0f0b14', '#581016'],
  ['#07171c', '#0b2126'],
  ['#131a22', '#000000']
]; // used when the artwork doesn't have bgColor properties

const getArtworkUrl = (
  artwork: MusicKit.Artwork | undefined,
  width: number,
  height: number
): string => {
  if (!artwork) {
    return PLACEHOLDER_IMAGE;
  }

  const url = artwork.url;

  if (!url) {
    return PLACEHOLDER_IMAGE;
  }

  const replace: { [key: string]: string } = {
    '{w}': width.toString(),
    '{h}': height.toString(),
    'bb.jpeg': 'sr.jpeg'
  };

  return url.replace(/{w}|{h}|bb.jpeg/gi, matched => {
    return replace[matched].toString();
  });
};

const getArtworkSize = (screenSize: string) => {
  switch (screenSize) {
    case 'xl':
      return 240;
    case 'lg':
      return 190;
    case 'md':
      return 170;
    case 'sm':
      return 180;
    default:
      return 160;
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
const getGradientBackgroundColorsFromArtwork = (
  artwork: MusicKit.Artwork | undefined
) => {
  const bgColorIndex = random(0, bgColors.length - 1);

  if (!artwork) {
    return bgColors[bgColorIndex];
  }

  const { bgColor, textColor1, textColor2, textColor3, textColor4 } = artwork;

  if (!bgColor) {
    return bgColors[bgColorIndex];
  }

  const colors = [bgColor, textColor1, textColor2, textColor3, textColor4];
  const gradientColors = [];

  for (const color of colors) {
    if (!color) {
      continue;
    }

    if (!isLight(color)) {
      gradientColors.push(`#${color}`);
    }
    if (gradientColors.length === 2) {
      break;
    }
  }

  if (gradientColors.length < 2) {
    gradientColors.push('#000000');
  }

  return gradientColors;
};

const getLightColorFromArtwork = (artwork: MusicKit.Artwork | undefined) => {
  if (!artwork) {
    return '#fff';
  }
  const { bgColor, textColor1, textColor2, textColor3, textColor4 } = artwork;
  const colors = [bgColor, textColor1, textColor2, textColor3, textColor4];

  for (const color of colors) {
    if (!color) {
      continue;
    }

    if (isLight(color)) {
      return `#${color}`;
    }
  }
  return '#fff';
};

export {
  getArtworkUrl,
  formatArtworkUrl,
  getSongsFromCollection,
  getArtworkSize,
  hexToRgb,
  getTextColorForBackground,
  getGradientBackgroundColorsFromArtwork,
  getLightColorFromArtwork
};
