const merge = require('webpack-merge');
const { HashedModuleIdsPlugin, NamedChunksPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadPlugin = require('preload-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const base = require('./webpack.common.config');

module.exports = merge(base, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new TerserPlugin({
        test: /\.m?js(\?.*)?$/i,
        chunkFilter: () => true,
        warningsFilter: () => true,
        extractComments: false,
        sourceMap: true,
        cache: true,
        cacheKeys: defaultCacheKeys => defaultCacheKeys,
        parallel: true,
        include: undefined,
        exclude: undefined,
        minify: undefined,
        terserOptions: {
          output: {
            comments: /^\**!|@preserve|@license|@cc_on/i
          },
          compress: {
            arrows: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,
            booleans: true,
            if_return: true,
            sequences: true,
            unused: true,
            conditionals: true,
            dead_code: true,
            evaluate: true
          },
          mangle: {
            safari10: true
          }
        }
      })
    ]
  },
  plugins: [
    /* config.plugin('hash-module-ids') */
    new HashedModuleIdsPlugin({
      hashDigest: 'hex'
    }),
    /* config.plugin('named-chunks') */
    new NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name;
      }

      const hash = require('hash-sum');
      const joinedHash = hash(Array.from(chunk.modulesIterable, m => m.id).join('_'));
      return `chunk-` + joinedHash;
    })
  ]
});
