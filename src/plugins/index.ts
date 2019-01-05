import Vue from 'vue';
import Vuetify from 'vuetify';
import VueLazyload from 'vue-lazyload';

Vue.use(Vuetify, {
  theme: {
    primary: '#041f35',
    secondary: '#113a5d',
    accent: '#da0f47',
    error: '#FF9800',
    primaryText: '#ffffff',
    secondaryText: '#BDBDBD'
  },
  options: {
    customProperties: true
  }
});

Vue.use(VueLazyload, {
  // set observer to true
  observer: true
});
