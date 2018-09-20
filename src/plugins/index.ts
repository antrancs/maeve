import Vue from 'vue';
// https://github.com/shakee93/vue-toasted/issues/81
// @ts-ignore
import Toasted from 'vue-toasted';

import ContextMenuPlugin from './contextMenu.plugin';

// Toasted plugin
Vue.use(Toasted, {
  theme: 'primary',
  position: 'bottom-center',
  duration: 4000
});

// @ts-ignore
Vue.toasted.register(
  'error',
  (payload: any) => {
    return payload.message || 'Something went wrong. Please try again later';
  },
  {
    type: 'error'
  }
);

// @ts-ignore
Vue.toasted.register(
  'notify',
  (payload: any) => {
    return payload.message || '';
  },
  {
    type: 'success'
  }
);

Vue.use(ContextMenuPlugin);
