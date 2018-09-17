import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
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
      component: () => import('./views/SearchViewAll.vue')
    },
    {
      path: '/albums/:id',
      name: 'albums',
      component: () => import('./views/CollectionDetail.vue'),
      props: true
    },
    {
      path: '/playlists/:id',
      name: 'playlists',
      component: () => import('./views/CollectionDetail.vue'),
      props: true
    },
    {
      path: '/me/library-playlists/:id',
      name: 'library-playlists',
      component: () => import('./views/CollectionDetail.vue'),
      props: true
    },
    {
      path: '/me/library-albums/:id',
      name: 'library-albums',
      component: () => import('./views/CollectionDetail.vue'),
      props: true
    },
    {
      path: '/artists/:id',
      name: 'artists',
      component: () => import('./views/ArtistDetail.vue')
    },
    {
      path: '/me/for-you',
      name: 'forYou',
      component: () => import('./views/ForYou.vue')
    },
    {
      path: '/me/playlists',
      name: 'myPlaylists',
      component: () => import('./views/Playlists.vue')
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
