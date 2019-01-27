const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
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
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /https:\/\/js-cdn.music.apple.com\/musickit/,
          handler: 'networkFirst',
          options: {
            cacheName: 'musickit-js-cache',
            expiration: {
              maxEntries: 1,
              maxAgeSeconds: 24 * 60 * 60 // 1 day
            }
          }
        },
        {
          urlPattern: /https:\/\/fonts.googleapis.com/,
          handler: 'staleWhileRevalidate'
        },
        {
          urlPattern: /ssl.mzstatic.com\/image/,
          handler: 'networkFirst',
          options: {
            cacheName: 'image-cache',
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
          urlPattern: /https:\/\/api.music.apple.com/,
          // Apply a network-first strategy.
          handler: 'networkFirst',
          options: {
            networkTimeoutSeconds: 5,
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 24 * 60 * 60 // 1 day
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  },
  productionSourceMap: false
};
