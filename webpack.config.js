var path    = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var minify  = process.argv.indexOf('--minify') != -1;
var plugins = [
  new ExtractTextPlugin('bundle.css', { allChunks: true })
];

if (minify) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  entry: __dirname + '/public/src/app.js',
  output: {
    path: __dirname + '/public/build',
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
        include: __dirname + '/public/src',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  },
  plugins: plugins
}
