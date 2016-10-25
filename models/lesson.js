var mongoose = require('mongoose');

var LessonSchema = new mongoose.Schema({
  courseId     : { type: String, required: false },
  title        : { type: String, required: true  },
  objective    : { type: String, required: false },
  dueDate      : { type: String, required: false },
  instructions : { type: String, required: false },
  text         : { type: String, required: true  }
});

var Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;
