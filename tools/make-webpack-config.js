const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = function makeWebpackConfig(options) {
  let entry;

  if (options.isServer) {
    entry = {
      server: './src/server/bin/www',
    };
  } else {
    entry = {
      main: './src/client/index.js',
    };
  }

  const defaultLoaders = [
    { test: /\.json5$/, use: ['json5-loader'] },
    { test: /\.txt$/, use: ['raw-loader'] },
    {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    },
    { test: /\.html$/, use: ['html-loader'] },

    // font awesome
    {
      test: /\.woff2?(\?v=\d+\.\d+\.\d+|\?.*)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+|\?.*)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/octet-stream',
        },
      },
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+|\?.*)?$/,
      use: ['file-loader'],
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+|\?.*)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/svg+xml',
        },
      },
    },
  ];
  const postCssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
    },
  };
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: true,
    },
  };
  let stylesheetLoaders = [
    {
      test: /\.css$/,
      use: [cssLoader, postCssLoader],
    },
    {
      test: /\.scss$/,
      use: [
        cssLoader,
        postCssLoader,
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            outputStyle: 'expanded',
            sourceMapContents: true,
          },
        },
      ],
    },
    {
      test: /\.sass$/,
      use: [
        cssLoader,
        postCssLoader,
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            indentedSyntax: true,
            outputStyle: 'expanded',
            sourceMapContents: true,
          },
        },
      ],
    },
  ];

  const devHost = process.env.DEV_SERVER_HOST || 'localhost';
  const devPort = process.env.DEV_SERVER_PORT || 2992;

  const publicPath = options.devServer ?
    `http://${devHost}:${devPort}/_assets/` :
    '/_assets/';

  const output = {
    path: options.isServer
      ? path.join(__dirname, '..', 'build', 'server')
      : path.join(__dirname, '..', 'public', '_assets'),
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
    // /node_modules[\\/]react(-router)?[\\/]/,
  ];
  const plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    function statsPlugin() {
      this.plugin('done', (stats) => {
        const jsonStats = stats.toJson({
          chunkModules: true,
          exclude: excludeFromStats,
        });
        jsonStats.publicPath = publicPath;
        if (!fs.existsSync(path.join(__dirname, '..', 'build'))) {
          fs.mkdirSync(path.join(__dirname, '..', 'build'));
        }
        if (!options.isServer) {
          fs.writeFileSync(path.join(__dirname, '..', 'build', 'stats.json'), JSON.stringify(jsonStats));
        } else {
          fs.writeFileSync(path.join(__dirname, '..', 'build', 'serverStats.json'), JSON.stringify(jsonStats));
        }
      });
    },
  ];

  const alias = {
    router1: 'router1/src',
    'router1-react': 'router1-react/src',
    'rx-react-container': 'rx-react-container/src',
  };

  const aliasLoader = {};
  const externals = [];

  if (options.isServer) {
    aliasLoader['react-proxy$'] = 'react-proxy/unavailable';
    const nodeModules = fs.readdirSync(path.join(__dirname, '..', 'node_modules')).filter(x => x !== '.bin');
    externals.push(
      {
        '../build/stats.json': 'commonjs ../stats.json',
      },
      ...nodeModules,
      /^rxjs\//,
      /^react\//,
      /^react-dom\//
    );

    plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
    if (options.sourceMapSupport) {
      plugins.push(
        new webpack.BannerPlugin(
          {
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
          }
        )
      );
    }
  }

  if (options.commonsChunk) {
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        filename: `commons.js${options.longTermCaching && !options.isServer ? '?[chunkhash]' : ''}`,
      })
    );
  }


  stylesheetLoaders = stylesheetLoaders.map((loaderIn) => {
    const loader = Object.assign({}, loaderIn);
    delete loader.use;

    if (options.isServer) {
      loader.use = ['null-loader'];
    } else if (options.separateStylesheet) {
      loader.loader = ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: loaderIn.use,
      });
    } else {
      loader.use = ['style-loader', ...loaderIn.use];
    }
    return loader;
  });

  if (options.separateStylesheet && !options.isServer) {
    plugins.push(
      new ExtractTextPlugin({
        filename: `[name].css${options.longTermCaching ? '?[contenthash]' : ''}`,
      })
    );
  }
  const definitions = {
    'process.env.NODE_ENV': options.debug ? JSON.stringify('development') : JSON.stringify('production'),
  };

  if (options.minimize) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new webpack.optimize.UglifyJsPlugin({
        // todo: check if needed
        sourceMap: true,
        compress: {
          warnings: false,
        },
      }),
      new webpack.NoEmitOnErrorsPlugin()
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
    babelLoader.use = {
      loader: 'babel-loader',
      options: {
        presets: ['react'],
        plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
        babelrc: false,
      },
    };
  } else if (options.hotComponents) {
    babelLoader.use = [
      'react-hot-loader',
      {
        loader: 'babel-loader',
        options: {
          presets: [
            'react',
            'es2015',
          ],
          plugins: [
            'transform-runtime',
          ],
        },
      }];
  } else {
    babelLoader.use = ['babel-loader'];
  }
  if (options.debug) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        debug: true,
      })
    );
  }

  return {
    entry,
    output,
    target: options.isServer ? 'node' : 'web',
    module: {
      rules: [
        babelLoader,
        Object.assign({}, babelLoader, {
          test: /node_modules\/(?:router1|router1-react|rx-react-container)\/src/,
          exclude: undefined,
        }),
      ]
        .concat(defaultLoaders)
        .concat(stylesheetLoaders),
    },
    devtool: options.devtool,
    externals,
    resolve: {
      modules: [
        'web_modules',
        'node_modules',
      ],
      extensions: ['.web.js', '.js', '.jsx'],
      mainFields: (options.isServer ? [] : ['browser']).concat(
        'module',
        // todo:
        // 'jsnext:main',
        'main'
      ),
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
