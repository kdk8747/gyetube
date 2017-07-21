var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.config.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
const HOST_NAME = process.env.HOST_NAME = 'localhost';
const PORT = process.env.PORT = 8080;

module.exports = webpackMerge(commonConfig, {
  output: {
    path: helpers.root('public'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'HOST_NAME': JSON.stringify(HOST_NAME),
        'PORT': JSON.stringify(PORT)
      }
    }),
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    port: PORT,
    proxy: {
      '**': 'http://localhost:5000'
    }
  }
});
