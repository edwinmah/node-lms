var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  instructor  : { type: String, required: true  },
  term        : { type: String, required: false },
  title       : { type: String, required: true  },
  description : { type: String, required: false }
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
