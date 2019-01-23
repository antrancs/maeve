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
      appleTouchIcon: 'img/icons/150.png',
      msTileImage: 'img/icons/150.png'
    }
  },
  productionSourceMap: false
};
