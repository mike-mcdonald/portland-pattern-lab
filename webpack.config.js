const path = require('path');
const globby = require('globby');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ArcGISPlugin = require('@arcgis/webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = (env, argv) => ({
  entry: {
    main: ['./source/_patterns/_index.ts', '@dojo/framework/shim/Promise', './source/_patterns/_index.scss']
  },
  devtool: 'cheap-eval-source-map',
  mode: process.env.NODE_ENV,
  stats: 'none',
  output: {
    path: path.resolve(__dirname, 'public', 'js'),
    filename: '[name].bundle.js',
    publicPath: '../../js/'
  },
  resolve: {
    extensions: ['.vue', '.json', '.wasm', '.ts', '.js'],
    modules: ['node_modules', path.resolve(__dirname, 'node_modules')]
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
    new ForkTsCheckerWebpackPlugin({
      vue: true,
      tslint: true,
      formatter: 'codeframe',
      checkSyntacticErrors: false
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
