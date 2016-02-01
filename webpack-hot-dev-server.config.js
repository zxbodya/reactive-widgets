import makeWebpackConfig from './make-webpack-config';

const config = makeWebpackConfig({
  devServer: true,
  hotComponents: true,
  devtool: 'eval',
  debug: true,
});
export default config;
module.exports = config;
