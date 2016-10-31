var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
  new ExtractTextPlugin('bundle.css', { allChunks: true }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
];

module.exports = {
  entry: __dirname + '/public/src/app.js',
  output: {
    path: __dirname + '/public/build',
    filename: 'bundle.js',
  },
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
  externals: {
    'fs': 'fs'
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  },
  plugins: plugins
}
