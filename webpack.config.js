var path = require('path');

var webpack = require('webpack');

//var packageData = require('./package.json');

//var filename = [packageData.name, packageData.version, 'js'];

module.exports = {
  entry: './public/js/app.js',
  output: {
    path: __dirname + '/public/js',
    filename: 'bundle.js',
  },
  watch: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  }
}
