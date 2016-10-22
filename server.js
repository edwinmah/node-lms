var express  = require('express');
var morgan   = require('morgan');
var mongoose = require('mongoose');
var config   = require('./config');
var app      = express();


app.use(morgan('combined'));
app.use(express.static('public'));


var runServer = function(callback) {
  mongoose.connect(config.DATABASE_URL, function(err) {
    if (err && callback) {
      return callback(err);
    }

    app.listen(config.PORT, function() {
      console.log('Listening on localhost:' + config.PORT);
      if (callback) {
        callback();
      }
    });
  });
};

var Course = require('./models/course');
var Lesson = require('./models/lesson');


if (require.main === module) {
  runServer(function(err) {
    if (err) {
      console.error(err);
    }
  });
};


exports.app       = app;
exports.runServer = runServer;
