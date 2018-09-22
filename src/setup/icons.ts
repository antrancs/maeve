import Vue from 'vue';
import Icon from 'vue-awesome/components/Icon.vue';

Vue.component('icon', Icon);

// @ts-ignore
Icon.register({
  explicit: {
    width: 24,
    height: 24,
    paths: [
      {
        style: 'fill:#aaa',
        d:
          'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z'
      }
    ]
  }
});
