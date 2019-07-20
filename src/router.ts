import Vue from 'vue';
import Router from 'vue-router';

import store from '@/store';
import NotFound from './views/NotFound.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: { name: 'home', params: { tab: 'explore' } }
    },
    {
      path: '/home/:tab?',
      name: 'home',
      component: () =>
        import(/* webpackChunkName: "home" */ './views/Home.vue'),
      props: true
    },
    {
      path: '/index.html',
      redirect: { name: 'home', params: { tab: 'explore' } }
    },
    {
      path: '/charts/:tab?',
      name: 'charts',
      component: () =>
        import(/* webpackChunkName: "charts" */ './views/Charts.vue'),
      props: true
    },
    {
      path: '/auth/lastfm/success',
      name: 'lastfmAuthSuccess',
      component: () =>
        import(
          /* webpackChunkName: "lastfmAuthSuccess" */ './views/LastFmAuthSuccess.vue'
        )
    },
    {
      path: '/lastfm-page',
      name: 'lastfm',
      component: () =>
        import(/* webpackChunkName: "lastfm" */ './views/Lastfm.vue')
    },
    {
      path: '/featured-playlists',
      name: 'featuredPlaylists',
      component: () =>
        import(
          /* webpackChunkName: "featuredPlaylists" */ './views/FeaturedPlaylists.vue'
        )
    },
    {
      path: '/search',
      name: 'search',
      component: () =>
        import(
          /* webpackChunkName: "searchResults" */ './views/SearchResults.vue'
        )
    },
    {
      path: '/search/:type',
      name: 'searchViewAll',
      component: () =>
        import(
          /* webpackChunkName: "searchViewAll" */ './views/SearchViewAll.vue'
        ),
      props: true
    },
    {
      path: '/albums/:id',
      name: 'albums',
      component: () =>
        import(
          /* webpackChunkName: "collectionDetail" */ './views/CollectionDetail.vue'
        ),
      props: true
    },
    {
      path: '/playlists/:id',
      name: 'playlists',
      component: () =>
        import(
          /* webpackChunkName: "collectionDetail" */ './views/CollectionDetail.vue'
        ),
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
        import(
          /* webpackChunkName: "activityDetail" */ './views/ActivityDetail.vue'
        ),
      props: true
    },
    {
      path: '/browse/:resource',
      name: 'browse',
      component: () =>
        import(/* webpackChunkName: "browse" */ './views/Browse.vue'),
      props: true
    },
    {
      path: '/genres/:id/:resource',
      name: 'genresViewAll',
      component: () =>
        import(
          /* webpackChunkName: "genreDetailViewAll" */ './views/GenreDetailViewAll.vue'
        ),
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
        import(
          /* webpackChunkName: "collectionDetail" */ './views/CollectionDetail.vue'
        ),
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/me/library-albums/:id',
      name: 'library-albums',
      component: () =>
        import(
          /* webpackChunkName: "collectionDetail" */ './views/CollectionDetail.vue'
        ),
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/me/library-artists/:id',
      name: 'library-artists',
      component: () =>
        import(
          /* webpackChunkName: "artistDetail" */ './views/ArtistDetail.vue'
        ),
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: '/artists/:id',
      name: 'artists',
      component: () =>
        import(
          /* webpackChunkName: "artistDetail" */ './views/ArtistDetail.vue'
        ),
      props: true
    },
    {
      path: '/artists/:id/:s/:resource',
      name: 'artistsViewAll',
      component: () =>
        import(
          /* webpackChunkName: "artistDetailViewAll" */ './views/ArtistDetailViewAll.vue'
        ),
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
      path: '/me/history',
      name: 'history',
      component: () =>
        import(/* webpackChunkName: "history" */ './views/History.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/me/library/artists',
      name: 'myLibraryArtists',
      component: () =>
        import(
          /* webpackChunkName: "myLibraryArtists" */ './views/MyLibraryArtists.vue'
        ),
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
    next({ name: 'home', params: { tab: 'explore' } });
  } else {
    next();
  }
});

export default router;
