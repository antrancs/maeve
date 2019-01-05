import Vue from 'vue';
import Router from 'vue-router';

import store from '@/store';
import Home from './views/Home.vue';
import CollectionDetail from './views/CollectionDetail.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('./views/SearchResults.vue')
    },
    {
      path: '/search/:type',
      name: 'searchViewAll',
      component: () => import('./views/SearchViewAll.vue'),
      props: true
    },
    {
      path: '/albums/:id',
      name: 'albums',
      component: CollectionDetail,
      props: true
    },
    {
      path: '/playlists/:id',
      name: 'playlists',
      component: CollectionDetail,
      props: true
    },
    {
      path: '/activities/:id',
      name: 'activities',
      component: () => import('./views/ActivityDetail.vue'),
      props: true
    },
    {
      path: '/me/library-playlists/:id',
      name: 'library-playlists',
      component: CollectionDetail,
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/me/library-albums/:id',
      name: 'library-albums',
      component: CollectionDetail,
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/artists/:id',
      name: 'artists',
      component: () => import('./views/ArtistDetail.vue'),
      props: true
    },
    {
      path: '/me/for-you',
      name: 'forYou',
      component: () => import('./views/ForYou.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/me/library/:resource',
      name: 'myLibrary',
      component: () => import('./views/MyLibrary.vue'),
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('./views/NotFound.vue')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});

router.beforeEach((to, from, next) => {
  // If not authorized, go back to Home
  if (
    to.matched.some(record => record.meta.auth) &&
    !store.getters.isAuthenticated
  ) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
