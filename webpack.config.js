const webpack = require('webpack');
const path = require('path');


module.exports = {
  entry: ['babel-polyfill','./src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module:{
    rules: [
      {
        test: /\.js$/,
        loaders: ["babel-loader"],
        exclude: /node_modules/
      },
    ]
  } 
}