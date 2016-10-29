var path = require('path');

var webpack = require('webpack');

//var packageData = require('./package.json');

//var filename = [packageData.name, packageData.version, 'js'];

module.exports = {
  entry: path.resolve(__dirname, '/public/js/app.js'),
  output: {
    path: path.resolve(__dirname, '/public/js'),
    filename: 'build.js',
  },
  watch: true,
  devtool: 'source-map'
}
