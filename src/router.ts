import Vue from 'vue';
import Router from 'vue-router';

import store from '@/store';
import NotFound from './views/NotFound.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
    },
    {
      path: '/charts',
      name: 'charts',
      component: () =>
        import(/* webpackChunkName: "charts" */ './views/Charts.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () =>
        import(/* webpackChunkName: "searchResults" */ './views/SearchResults.vue')
    },
    {
      path: '/search/:type',
      name: 'searchViewAll',
      component: () =>
        import(/* webpackChunkName: "searchViewAll" */ './views/SearchViewAll.vue'),
      props: true
    },
    {
      path: '/albums/:id',
      name: 'albums',
      component: () =>
        import(/* webpackChunkName: "albums" */ './views/CollectionDetail.vue'),
      props: true
    },
    {
      path: '/playlists/:id',
      name: 'playlists',
      component: () =>
        import(/* webpackChunkName: "playlists" */ './views/CollectionDetail.vue'),
      props: true
    },
    {
      path: '/curators/:id',
      name: 'curators',
      component: () =>
        import(/* webpackChunkName: "curators" */ './views/CuratorDetail.vue'),
      props: true
    },
    {
      path: '/activities/:id',
      name: 'activities',
      component: () =>
        import(/* webpackChunkName: "activityDetail" */ './views/ActivityDetail.vue'),
      props: true
    },
    {
      path: '/genres/:id',
      name: 'genres',
      component: () =>
        import(/* webpackChunkName: "genreDetail" */ './views/GenreDetail.vue'),
      props: true
    },
    {
      path: '/me/library-playlists/:id',
      name: 'library-playlists',
      component: () =>
        import(/* webpackChunkName: "collectionDetail" */ './views/CollectionDetail.vue'),
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/me/library-albums/:id',
      name: 'library-albums',
      component: () =>
        import(/* webpackChunkName: "collectionDetail" */ './views/CollectionDetail.vue'),
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/me/library-artists/:id',
      name: 'library-artists',
      component: () =>
        import(/* webpackChunkName: "artistDetail" */ './views/ArtistDetail.vue'),
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/artists/:id',
      name: 'artists',
      component: () =>
        import(/* webpackChunkName: "artistDetail" */ './views/ArtistDetail.vue'),
      props: true
    },
    {
      path: '/me/for-you',
      name: 'forYou',
      component: () =>
        import(/* webpackChunkName: "forYou" */ './views/ForYou.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/me/library/artists',
      name: 'myLibraryArtists',
      component: () =>
        import(/* webpackChunkName: "myLibraryArtists" */ './views/MyLibraryArtists.vue'),
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/me/library/:resource',
      name: 'myLibrary',
      component: () =>
        import(/* webpackChunkName: "myLibrary" */ './views/MyLibrary.vue'),
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
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
