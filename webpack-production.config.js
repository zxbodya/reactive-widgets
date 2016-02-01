import makeWebpackConfig from './make-webpack-config';

const config = [
  makeWebpackConfig({
    // commonsChunk: true,
    longTermCaching: true,
    separateStylesheet: true,
    minimize: true,
    devtool: 'source-map',
  }),
  makeWebpackConfig({
    prerender: true,
  }),
];

export default config;
module.exports = config;
