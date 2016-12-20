const makeWebpackConfig = require('./make-webpack-config');

const config = makeWebpackConfig({
  isServer: true,
  devtool: 'inline-source-map',
  sourceMapSupport: true,
  debug: true,
});

module.exports = config;
