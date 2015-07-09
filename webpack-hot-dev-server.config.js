import makeWebpackConfig from './make-webpack-config';
export default makeWebpackConfig({
  devServer: true,
  hotComponents: true,
  devtool: 'eval',
  debug: true
});
