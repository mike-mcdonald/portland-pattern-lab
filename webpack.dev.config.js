const path = require('path');
const merge = require('webpack-merge');
const { ProgressPlugin } = require('webpack');

const base = require('./webpack.common.config');

module.exports = merge(base, {
  mode: 'development',
  watch: true,
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: '[name].bundle.js'
  },
  plugins: [
    /* config.plugin('progress') */
    new ProgressPlugin()
  ]
});
