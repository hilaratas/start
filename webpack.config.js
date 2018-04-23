'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'src/js'),
  entry: './main',
  output: {
    path: path.join(__dirname, 'build/js'),
    filename: 'main.js'
  },
  watch: false,
  plugins: [
    //new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a valid name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};

    // loaders: [
    //   {
    //     test: /\.js$/,
    //     exclude: /(node_modules)/,
    //     loader: 'babel', // 'babel-loader' is also a valid name to reference
    //     query: {
    //       presets: ['env']
    //     }
    //   }
    // ]
