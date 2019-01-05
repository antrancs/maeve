import color from 'tinycolor2';

import { ThemeOption } from '@/@types/model/model';

const TEXT_PRIMARY_DARK = '#ffffff';
const TEXT_SECONDARY_DARK = '#BDBDBD';

const TEXT_PRIMARY_LIGHT = '#0a0a0a';
const TEXT_SECONDARY_LIGHT = '#606060';

const defaultThemes: ThemeOption[] = [
  {
    id: 'default-dark',
    name: 'Default dark',
    primary: '#041f35',
    secondary: '#113a5d',
    accent: '#da0f47',
    primaryText: TEXT_PRIMARY_DARK,
    secondaryText: TEXT_SECONDARY_DARK,
    editable: false
  },
  {
    id: 'itunes-dark',
    name: 'Itunes dark',
    primary: '#1E2022',
    secondary: '#2B2C2F',
    accent: '#3086F7',
    primaryText: TEXT_PRIMARY_DARK,
    secondaryText: TEXT_SECONDARY_DARK,
    editable: false
  },
  {
    id: 'light-theme',
    name: 'Light theme',
    primary: '#fafafa',
    secondary: '#e3e3e3',
    accent: '#da0f47',
    primaryText: TEXT_PRIMARY_LIGHT,
    secondaryText: TEXT_SECONDARY_LIGHT,
    editable: false
  }
];

const isLight = (c: string) => {
  return color(c).getBrightness() > 165;
};

const lighten = (c: string, by: number) => {
  return color(c)
    .lighten(by)
    .toHex();
};

export {
  defaultThemes,
  isLight,
  TEXT_PRIMARY_DARK,
  TEXT_SECONDARY_DARK,
  TEXT_PRIMARY_LIGHT,
  TEXT_SECONDARY_LIGHT,
  lighten
};
