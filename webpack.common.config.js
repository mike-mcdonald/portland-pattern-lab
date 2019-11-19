const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { DefinePlugin } = require('webpack');
const ArcGISPlugin = require('@arcgis/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: {
    main: [
      path.resolve(__dirname, 'source', '_patterns', 'main.ts'),
      path.resolve(__dirname, 'source', '_patterns', 'main.scss')
    ]
  },
  devtool: 'cheap-eval-modules-source-map',
  mode: process.env.NODE_ENV,
  stats: 'none',
  resolve: {
    extensions: ['.vue', '.json', '.wasm', '.ts', '.js'],
    modules: ['node_modules', path.resolve(__dirname, 'node_modules')]
  },
  output: {
    path: path.resolve(__dirname, 'public', 'js'),
    publicPath: '../../js/'
  },
  plugins: [
    new ArcGISPlugin({
      useDefaultAssetLoaders: false
    }),
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
      vue: true,
      tslint: true,
      formatter: 'codeframe',
      checkSyntacticErrors: false
    }),
    new DefinePlugin({
      'process.env': {
        BASE_URL: '"/"'
      }
    }),
    new MiniCssExtractPlugin({
      filename: '../css/[name].bundle.css',
      chunkFilename: '../css/[name].bundle.css'
    }),
    new FriendlyErrorsWebpackPlugin()
  ],
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      {
        test: /\.vue$/,
        use: [
          'cache-loader',
          {
            loader: 'vue-loader'
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          'cache-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/]
            }
          },
          'eslint-loader'
        ],
        exclude: file => /node_modules/.test(file) && !/\.vue\.ts/.test(file)
      },
      {
        test: /\.js$/,
        use: ['cache-loader', 'babel-loader', 'eslint-loader'],
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: './postcss.config.js'
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
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
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
};
