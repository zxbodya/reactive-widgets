const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoPrefixer = require('autoprefixer');

module.exports = function makeWebpackConfig(options) {
  let entry;

  if (options.isServer) {
    entry = {
      server: './src/server/bin/www',
    };
  } else {
    entry = {
      main: './src/client/index',
    };
  }

  const defaultLoaders = [
    { test: /\.json5$/, loaders: ['json5-loader'] },
    { test: /\.txt$/, loaders: ['raw-loader'] },
    { test: /\.(png|jpg|jpeg|gif|svg)$/, loaders: ['url-loader?limit=10000'] },
    { test: /\.html$/, loaders: ['html-loader'] },

    // font awesome
    {
      test: /\.woff2?(\?v=\d+\.\d+\.\d+|\?.*)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff',
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+|\?.*)?$/,
      loader: 'url?limit=10000&mimetype=application/octet-stream',
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+|\?.*)?$/,
      loader: 'file',
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+|\?.*)$/,
      loader: 'url?limit=10000&mimetype=image/svg+xml',
    },
  ];
  let stylesheetLoaders = [
    { test: /\.css$/, loaders: ['css-loader!postcss-loader'] },
    { test: /\.scss$/, loaders: ['css-loader!postcss-loader!sass-loader?sourceMap'] },
    { test: /\.sass$/, loaders: ['css-loader!postcss-loader!sass-loader?sourceMap&indentedSyntax'] },
  ];

  const devHost = process.env.DEV_SERVER_HOST || 'localhost';
  const devPort = process.env.DEV_SERVER_PORT || 2992;

  const publicPath = options.devServer ?
    `http://${devHost}:${devPort}/_assets/` :
    '/_assets/';

  const output = {
    path: options.isServer
      ? path.join(__dirname, '..', 'build', 'server')
      : path.join(__dirname, '..', 'php', '_assets'),
    publicPath,
    filename: `[name].js${options.longTermCaching && !options.isServer ? '?[chunkhash]' : ''}`,
    chunkFilename: (
      (options.devServer ? '[id].js' : '[name].js')
      + (options.longTermCaching && !options.isServer ? '?[chunkhash]' : '')
    ),
    sourceMapFilename: 'debugging/[file].map',
    libraryTarget: options.isServer ? 'commonjs2' : undefined,
    pathinfo: options.debug,
  };
  const excludeFromStats = [
    /node_modules[\\/]react(-router)?[\\/]/,
  ];
  const plugins = [
    function statsPlugin() {
      this.plugin('done', (stats) => {
        const jsonStats = stats.toJson({
          chunkModules: true,
          exclude: excludeFromStats,
        });
        jsonStats.publicPath = publicPath;
        if (!options.isServer) {
          fs.writeFileSync(path.join(__dirname, '..', 'build', 'stats.json'), JSON.stringify(jsonStats));
        } else {
          fs.writeFileSync(path.join(__dirname, '..', 'build', 'serverStats.json'), JSON.stringify(jsonStats));
        }
      });
    },
    new webpack.PrefetchPlugin('react'),
  ];

  const alias = {};
  const aliasLoader = {};
  const externals = [];

  if (options.isServer) {
    aliasLoader['react-proxy$'] = 'react-proxy/unavailable';
    const nodeModules = fs.readdirSync(path.join(__dirname, '..', 'node_modules')).filter(x => x !== '.bin');
    externals.push(
      {
        //'../build/stats.json': 'commonjs ../stats.json',
      },
      'react-dom/server',
      ...nodeModules
    );

    plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
    if (options.sourceMapSupport) {
      plugins.push(
        new webpack.BannerPlugin('require("source-map-support").install();',
          { raw: true, entryOnly: false })
      );
    }
  }

  if (options.commonsChunk) {
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin(
        'commons',
        `commons.js${options.longTermCaching && !options.isServer ? '?[chunkhash]' : ''}`
      )
    );
  }


  stylesheetLoaders = stylesheetLoaders.map((loaderIn) => {
    const loader = Object.assign({}, loaderIn);
    if (Array.isArray(loader.loaders)) {
      loader.loaders = loader.loaders.join('!');
    }
    if (options.isServer) {
      loader.loaders = 'null-loader';
    } else if (options.separateStylesheet) {
      loader.loaders = ExtractTextPlugin.extract('style-loader', loader.loaders);
    } else {
      loader.loaders = `style-loader!${loader.loaders}`;
    }
    loader.loaders = loader.loaders.split('!');
    return loader;
  });

  if (options.separateStylesheet && !options.isServer) {
    plugins.push(new ExtractTextPlugin(`[name].css${options.longTermCaching ? '?[contenthash]' : ''}`));
  }
  const definitions = {
    'process.env.NODE_ENV': options.debug ? JSON.stringify('development') : JSON.stringify('production'),
  };

  if (options.minimize) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.NoErrorsPlugin()
    );
  }

  plugins.push(
    new webpack.DefinePlugin(definitions)
  );

  if (options.hotComponents) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  const babelLoader = {
    test: /\.jsx?$/,
    exclude: /node_modules/,
  };
  if (options.isServer) {
    babelLoader.loader = 'babel';
    babelLoader.query = {
      presets: ['react'],
      plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
      babelrc: false,
    };
  } else if (options.hotComponents) {
    babelLoader.loaders = ['react-hot', 'babel'];
  } else {
    babelLoader.loader = 'babel';
  }

  return {
    entry,
    output,
    target: options.isServer ? 'node' : 'web',
    module: {
      loaders: [
        babelLoader,
      ]
        .concat(defaultLoaders)
        .concat(stylesheetLoaders),
    },
    postcss() {
      return [autoPrefixer({ browsers: ['last 2 version'] })];
    },
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
      root: path.join(__dirname, '..', 'node_modules'),
      alias: aliasLoader,
    },
    externals,
    resolve: {
      modulesDirectories: ['web_modules', 'node_modules'],
      extensions: ['', '.web.js', '.js', '.jsx'],
      alias,
    },
    plugins,
    devServer: {
      stats: {
        cached: false,
        exclude: excludeFromStats,
      },
    },
  };
};
