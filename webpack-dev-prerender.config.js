import makeWebpackConfig from './make-webpack-config';
const config = makeWebpackConfig({
  prerender: true,
  devtool: 'inline-source-map',
  sourceMapSupport: true,
  debug: true,
});

export default config;
module.exports = config;
