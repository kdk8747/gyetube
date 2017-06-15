var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.config.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  output: {
    path: helpers.root('public'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    port: 8080,
    proxy: {
      "**": "http://localhost:5000"
    }
  }
});
