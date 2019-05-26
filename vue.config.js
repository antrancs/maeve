const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
            @import "@/styles/base/_setting.scss";
            @import "@/styles/base/_function.scss";
          `
      }
    }
  },
  configureWebpack: {
    plugins: [new VuetifyLoaderPlugin()]
  },
  pwa: {
    name: 'Maeve',
    appleMobileWebAppCapable: 'yes',
    msTileColor: '#041f35',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-150x150.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    },
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: false,
      clientsClaim: true,
      importScripts: ['/sw-skip-waiting.js'],
      runtimeCaching: [
        {
          urlPattern: /https:\/\/js-cdn\.music\.apple\.com\/.*\/musickit\.js/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'musickit-js-cache'
          }
        },
        {
          urlPattern: new RegExp(
            'https://fonts.(?:googleapis|gstatic).com/(.*)'
          ),
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'font-cache'
          }
        },
        {
          urlPattern: /https:\/\/is\d-ssl\.mzstatic\.com\/image/,
          handler: 'cacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 2 * 24 * 60 * 60 // 2 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /https:\/\/api\.music\.apple\.com/,
          // Apply a network-first strategy.
          handler: 'networkFirst',
          options: {
            networkTimeoutSeconds: 2,
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60 // 1 day
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /https:\/\/maevemusic\.app\/api\/catalog\/albums\/featuredAlbums/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'catalog-featured-albums',
            expiration: {
              maxEntries: 1
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /https:\/\/maevemusic\.app\/api\/catalog\/genres/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'catalog-genres',
            expiration: {
              maxEntries: 1
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /https:\/\/maevemusic\.app\/api\/catalog\/playlists\/featured/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'catalog-featured-playlists',
            expiration: {
              maxEntries: 2
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  },
  devServer: {
    proxy: {
      '/lastfm/api/': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/lastfm/auth': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  productionSourceMap: false
};
