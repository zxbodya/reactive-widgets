import makeWebpackConfig from './make-webpack-config';
export default makeWebpackConfig({
    prerender: true,
    devtool: 'inline-source-map',
    sourceMapSupport: true,
    debug: true
  });
