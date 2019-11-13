const path = require('path');
const globby = require('globby');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ArcGISPlugin = require('@arcgis/webpack-plugin');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = (env, argv) => ({
  entry: {
    main: ['./source/_patterns/_index.js', '@dojo/framework/shim/Promise', './source/_patterns/_index.scss']
  },
  devtool: 'source-map',
  mode: process.env.NODE_ENV,
  stats: 'none',
  output: {
    path: path.resolve(__dirname, 'public', 'js'),
    filename: '[name].bundle.js',
    publicPath: '../../js/'
  },
  watchOptions: {
    ignored: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'images'),
      path.resolve(__dirname, 'css')
    ]
  },
  plugins: [
    new ArcGISPlugin({
      useDefaultAssetLoaders: false
    }),
    new MiniCssExtractPlugin({
      filename: '../css/style.bundle.css',
      chunkFilename: '../css/[id].bundle.css'
    }),
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: './postcss.config.js',
                ctx: {
                  mode: argv.mode
                }
              }
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        loader: 'file-loader'
      }
    ]
  },
  externals: [
    (context, request, callback) => {
      if (/pe-wasm$/.test(request)) {
        return callback(null, 'amd ' + request);
      }
      callback();
    }
  ],
  node: {
    process: false,
    global: false,
    fs: 'empty'
  }
});
