const makeWebpackConfig = require('./make-webpack-config');


const config = [
  makeWebpackConfig({
    // commonsChunk: true,
    longTermCaching: true,
    separateStylesheet: true,
    minimize: true,
    // devtool: "source-map",
  }),
  makeWebpackConfig({
    prerender: true,
  }),
];

module.exports = config;
