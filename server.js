var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var config     = require('./config');
var app        = express();


app.use(morgan('combined'));
app.use(bodyParser.json());
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


/************
 * Endpoints
 ************/
app.get('/course', function(req, res) {
  Course.find(function(err, course) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    }
    res.json(course);
  });
});

app.get('/lessons', function(req, res) {
  Lesson.find(function(err, lessons) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    }
    res.json(lessons);
  });
});

app.post('/course', function(req, res) {
  var query = {
    instructor  : req.body.instructor,
    term        : req.body.term,
    title       : req.body.title,
    description : req.body.description
  };

  Course.create(query, function(err, course) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    }
    res.status(201).json(course);
  });
});

app.post('/lessons', function(req, res) {
  var query = {
      courseId     : req.body.courseId,
      title        : req.body.title,
      objective    : req.body.objective,
      dueDate      : req.body.dueDate,
      instructions : req.body.instructions,
      text         : req.body.text
    };

  Lesson.create(query, function(err, lessons) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    }
    res.status(201).json(lessons);
  });
});

app.put('/course/:id', function(req, res) {
  var query  = { _id : req.params.id },
      update = {
            $set: {
                instructor  : req.body.instructor,
                term        : req.body.term,
                title       : req.body.title,
                description : req.body.description
              }
           };

  Course.findOneAndUpdate(query, update, function(err, course) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    }
    res.status(200).json(course);
  });
});

app.put('/lessons/:id', function(req, res) {
  var query  = { _id : req.params.id },
      update = {
            $set: {
                title        : req.body.title,
                objective    : req.body.objective,
                dueDate      : req.body.dueDate,
                instructions : req.body.instructions,
                text         : req.body.text
              }
            };

  Lesson.findOneAndUpdate(query, update, function(err, lessons) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    }
    res.status(200).json(lessons);
  });
});

app.delete('/course/:id', function(req, res) {
  var query  = { _id : req.params.id };

  Course.findOneAndRemove(query, function(err, course) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    }
    res.status(200).json(course);
  });
});

app.delete('/lessons/:id', function(req, res) {
  var query  = { _id : req.params.id };

  Lesson.findOneAndRemove(query, function(err, lessons) {
    if (err) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    }
    res.status(200).json(lessons);
  });
});


if (require.main === module) {
  runServer(function(err) {
    if (err) {
      console.error(err);
    }
  });
};


exports.app       = app;
exports.runServer = runServer;
