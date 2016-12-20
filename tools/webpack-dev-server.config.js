const makeWebpackConfig = require('./make-webpack-config');

const config = makeWebpackConfig({
  devServer: true,
  devtool: 'inline-source-map', // eval
  debug: true,
});

module.exports = config;
