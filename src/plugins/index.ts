import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VueLazyload from 'vue-lazyload';
import 'vuetify/src/stylus/app.styl';

import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { defaultThemes } from '@/themes';

const defaultTheme = defaultThemes[0]; // first theme is the default one

Vue.use(Vuetify, {
  theme: {
    primary: defaultTheme.primary,
    secondary: defaultTheme.secondary,
    accent: defaultTheme.accent,
    error: '#FF9800',
    primaryText: defaultTheme.primaryText,
    secondaryText: defaultTheme.secondaryText
  },
  options: {
    customProperties: true
  }
});

Vue.use(VueLazyload, {
  // set observer to true
  observer: true,
  loading: PLACEHOLDER_IMAGE
});
