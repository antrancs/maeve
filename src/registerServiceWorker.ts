/* eslint-disable no-console */

import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      );
    },
    registered() {
      console.log('Service worker has been registered.');
    },
    cached() {
      // store.dispatch(SHOW_SNACKBAR, {
      //   text: 'Content has been cached for offline use.'
      // });
      console.log('Content has been cached for offline use.');
    },
    updatefound() {
      console.log('New content is downloading.');
    },
    updated(registration) {
      // store.dispatch(SHOW_SNACKBAR, {
      //   text: 'New content is available'
      // });
      console.log('New content is available; please refresh.');
      document.dispatchEvent(
        new CustomEvent('swUpdated', { detail: registration })
      );
    },
    offline() {
      // store.dispatch(SHOW_SNACKBAR, {
      //   text: `You are in offline mode. Playing music is not available`
      // });
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    }
  });
}
