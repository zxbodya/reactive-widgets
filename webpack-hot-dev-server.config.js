const makeWebpackConfig = require('./make-webpack-config');

const config = makeWebpackConfig({
  devServer: true,
  hotComponents: true,
  devtool: 'eval',
  debug: true,
});

module.exports = config;
