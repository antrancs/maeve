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
  productionSourceMap: false
};
