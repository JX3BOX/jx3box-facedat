const path = require("path");
const pkg = require("./package.json");
const { JX3BOX } = require("@jx3box/jx3box-common");

module.exports = {
  //❤️ Multiple pages ~
  pages: {
    index: {
      title: "Facedat",
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
    // body: {
    //   title: "Bodydat",
    //   entry: "src/pages/body.js",
    //   template: "public/index.html",
    //   filename: "body/index.html",
    // },
  },

  //❤️ define path for static files ~
  publicPath:
    //FOR Localhost => development
    (process.env.NODE_ENV === "development" && "/") ||
    //BY origin
    (process.env.STATIC_PATH === "origin" &&
      `${JX3BOX.__staticPath["origin"]}${pkg.name}/`) ||
    //BY github
    (process.env.STATIC_PATH === "github" &&
      `${JX3BOX.__staticPath["github"]}${pkg.name}/`) ||
    //BY jsdelivr
    (process.env.STATIC_PATH === "jsdelivr" &&
      `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`) ||
    //BY OSS=>CDN
    (process.env.STATIC_PATH === "mirror" &&
      `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`) ||
    //BY relative path
    (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) ||
    //BY root path or bind a domain
    (process.env.STATIC_PATH == "root" && "/") ||
    //for lost
    "/",

  //❤️ Porxy ~
  // devServer: {
  //     proxy: {
  //         "/api": {
  //             "target": process.env["DEV_SERVER"] == "true" ? "http://localhost:51818" : "https://next.jx3box.com",
  //             "onProxyReq": function (request) {
  //                 request.setHeader("origin", "");
  //             }
  //         }
  //     }
  // },

  chainWebpack: (config) => {
    //💘 html-webpack-plugin ~
    // Multiple pages disable the block below
    // config.plugin("html").tap(args => {
    //     args[0].meta = {                            //------设置SEO信息
    //         Keywords: Setting.keys,
    //         Description: Setting.desc
    //     };
    //     args[0].title = Setting.title + SEO.title;  //------自动添加标题后缀
    //     return args;
    // });

    //💝 in-line small imgs ~
    // Vue CLI 5 已默认配置，不需要单独配置 url-loader
    
    //💝 in-line svg imgs ~
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader");

    //💖 import common less var * mixin ~
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    var preload_styles = [];
    preload_styles.push(
      path.resolve(__dirname, "./node_modules/csslab/base.less"),
      path.resolve(
        __dirname,
        "./node_modules/@jx3box/jx3box-common/css/var.less"
      )
      // path.resolve(__dirname, './src/assets/css/var.less')
    );
    function addStyleResource(rule) {
      rule.use("style-resource").loader("style-resources-loader").options({
        patterns: preload_styles,
      });
    }
    types.forEach((type) =>
      addStyleResource(config.module.rule("less").oneOf(type))
    );
  },
};
