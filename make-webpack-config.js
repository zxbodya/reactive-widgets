'use strict';

var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function (options) {
  var entry;

  if (options.prerender) {
    entry = {
      server: "./src/server/bin/www"
    };
  } else {
    entry = {
      main: "./src/client"
    };
  }

  var defaultLoaders = [
    {test: /\.coffee$/, loaders: ['coffee-redux-loader']},
    {test: /\.json5$/, loaders: ['json5-loader']},
    {test: /\.txt$/, loaders: ['raw-loader']},
    {test: /\.(png|jpg|jpeg|gif|svg)$/, loaders: ['url-loader?limit=10000']},
    {test: /\.(woff|woff2)$/, loaders: ['url-loader?limit=100000']},
    {test: /\.(ttf|eot)$/, loaders: ['file-loader']},
    {test: /\.(wav|mp3)$/, loaders: ['file-loader']},
    {test: /\.html$/, loaders: ['html-loader']},
    {test: /\.(md|markdown)$/, loaders: ["html-loader", "markdown-loader"]}
  ];
  var stylesheetLoaders = [
    {test: /\.css$/, loaders: ['css-loader']},
    {test: /\.less$/, loaders: ['css-loader!less-loader']},
    {test: /\.styl$/, loaders: ['css-loader!stylus-loader']},
    {test: /\.(scss|sass)$/, loaders: ['css-loader!sass-loader']}
  ];

  var alias = {};
  var aliasLoader = {};
  var externals = [];
  var modulesDirectories = ["web_modules", "node_modules"];
  var extensions = ["", ".web.js", ".js", ".jsx"];
  var root = path.join(__dirname, "app");
  var publicPath = options.devServer ?
    "http://localhost:2992/_assets/" :
    ( options.prerender ? 'build/server/' : '/_assets/');

  var output = {
    path: path.join(__dirname,  "build", options.prerender ? "server" : "public"),
    publicPath: publicPath,
    filename: "[name].js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
    chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
    sourceMapFilename: "debugging/[file].map",
    libraryTarget: options.prerender ? "commonjs2" : undefined,
    pathinfo: options.debug
  };
  var excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/
  ];
  var plugins = [
    function () {
      if (!options.prerender) {
        this.plugin("done", function (stats) {
          var jsonStats = stats.toJson({
            chunkModules: true,
            exclude: excludeFromStats
          });
          jsonStats.publicPath = publicPath;
          require("fs").writeFileSync(path.join(__dirname, "build", "stats.json"), JSON.stringify(jsonStats));
        });
      } else {
        this.plugin("done", function (stats) {
          var jsonStats = stats.toJson({
            chunkModules: true,
            exclude: excludeFromStats
          });
          jsonStats.publicPath = publicPath;
          require("fs").writeFileSync(path.join(__dirname, "build", "server", "stats.json"), JSON.stringify(jsonStats));
        });
      }
    },
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment")
  ];
  if (options.prerender) {
    aliasLoader["react-proxy$"] = "react-proxy/unavailable";
    externals.push(
      {
        '../build/stats.json': "commonjs ../stats.json"
      },
      /^react(\/.*)?$/,
      "superagent",
      "express",
      "async",
      "rx",
      "path",
      "core-js",
      "debug",
      "morgan",
      "body-parser",
      "lodash",
      /^babel-runtime(\/.*)?$/
    );
    plugins.push(new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}));
    if (options.sourceMapSupport) {
      plugins.push(
        new webpack.BannerPlugin('require("source-map-support").install();',
          {raw: true, entryOnly: false})
      )
    }
  }
  if (options.commonsChunk) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin("commons", "commons.js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : "")));
  }


  stylesheetLoaders = stylesheetLoaders.map(function (loader) {
    if (Array.isArray(loader.loaders)) {
      loader.loaders = loader.loaders.join("!");
    }
    if (options.prerender) {
      loader.loaders = "null-loader";
    } else if (options.separateStylesheet) {
      loader.loaders = ExtractTextPlugin.extract("style-loader", loader.loaders);
    } else {
      loader.loaders = "style-loader!" + loader.loaders;
    }
    loader.loaders = [loader.loaders];
    return loader;
  });

  if (options.separateStylesheet && !options.prerender) {
    plugins.push(new ExtractTextPlugin("[name].css" + (options.longTermCaching ? "?[contenthash]" : "")));
  }
  if (options.minimize) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      }),
      new webpack.NoErrorsPlugin()
    );
  }

  return {
    entry: entry,
    output: output,
    target: options.prerender ? "node" : "web",
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: options.hotComponents ? ['react-hot', 'babel?optional=runtime'] : ['babel?optional=runtime'],
          exclude: /node_modules/
        }
      ]
        .concat(defaultLoaders)
        .concat(stylesheetLoaders)
    },
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
      root: path.join(__dirname, "node_modules"),
      alias: aliasLoader
    },
    externals: externals,
    resolve: {
      root: root,
      modulesDirectories: modulesDirectories,
      extensions: extensions,
      alias: alias
    },
    plugins: plugins,
    devServer: {
      stats: {
        cached: false,
        exclude: excludeFromStats
      }
    }
  };
};
