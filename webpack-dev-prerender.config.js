module.exports =
  require("./make-webpack-config")({
    prerender: true,
    devtool: "inline-source-map",
    sourceMapSupport: true,
    debug: true
  });
