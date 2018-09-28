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
  productionSourceMap: false
};
