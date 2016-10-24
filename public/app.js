/*********
 * Events
 *********/
$('#login').submit(function(event) {
  event.preventDefault();
  console.log('login occurred');
});

$('[role="banner"]').on('click', '#newCourse', function(event) {
  event.preventDefault();
  displayCourseForm.call(this);
});

$('[role="banner"]').on('click', '#submitCourse', function(event) {
  event.preventDefault();
  addCourse.call(this);
});

$('[role="banner"]').on('click', '#editCourse', function(event) {
  var key = '' + $(this).data('key');
  displayCourseForm.call(this, key);
});

$('[role="banner"]').on('click', '#saveEditCourse', function(event) {
  var key = '' + $(this).data('key');
  editCourse.call(this, key);
});

$('[role="banner"]').on('click', '#deleteCourse', function(event) {
  var key = '' + $(this).data('key');
  deleteCourse(key);
});

$('#course-lessons').on('click', '.lesson__link', function(event) {
  event.preventDefault();
  var key = '' + $(this).data('key');
  getAndDisplaySingleLesson(key);
});

$('#newLesson').on('click', function(event) {
  event.preventDefault();
  displayLessonForm.call(this);
});

$('main').on('click', '#submitLesson', function(event) {
  event.preventDefault();
  addLesson();
});

$('main').on('click', '#editLesson', function(event) {
  event.preventDefault();
  var key = '' + $(this).data('key');
  displayLessonForm.call(this, key);
});

$('main').on('click', '#saveEditLesson', function(event) {
  event.preventDefault();
  var key = '' + $(this).data('key');
  editLesson(key);
});

$('#course-lessons').on('click', '#deleteLesson', function(event) {
  var key = '' + $(this).data('key');
  deleteLesson(key);
});


/***********
 * Get data
 ***********/
function getCourseInfo() {
  return new Promise(function(resolve, reject) {
    $.ajax('/course', {
      type: 'GET',
      dataType: 'json'
    })
      .done(function(course) {
        resolve(course);
    });
  });
}

function getAllLessons() {
  return new Promise(function(resolve, reject) {
    $.ajax('/lessons', {
      type: 'GET',
      dataType: 'json'
    })
      .done(function(lessons) {
        resolve(lessons);
    });
  });
}

function getSingleLesson(id) {
  return new Promise(function(resolve, reject) {
    $.ajax('/lessons', {
      type: 'GET',
      dataType: 'json'
    })
      .done(function(lessons) {
        resolve(lessons.filter(function(doc) {
          return doc._id === id;
        })[0]);
      }, 100);
    });
}


/***************
 * Display data
 **************/
function displayCourseInfo(course) {
    var courseTitle  = '<h1 class="course__title">' + course[0].title + '</h1>';
    var editCourse   = '<span id="editCourse" data-key="' + course[0]._id + '">Edit</span>';
    var deleteCourse = '<span id="deleteCourse" style="margin-left: 1em;" data-key="' + course[0]._id + '">x</span>';
    var instructor   = '<p class="course__instructor">' + course[0].instructor + '</p>';
    var term         = '<p class="course__term">' + course[0].term + '</p>';
    var description  = '<p class="course__description">' + course[0].description + '</p>';

    var output  = courseTitle;
        output += editCourse;
        output += deleteCourse;
        output += instructor;
        output += (course[0].term) ? term : '';
        output += (course[0].description) ? description : '';

  $('.course-info').html(output);
}

function displayAllLessons(lessons) {
  $('#lessons-list').html('');
  for (index in lessons) {
    var title   = lessons[index].title;
    var dueDate = lessons[index].dueDate;
    var _id     = lessons[index]._id;

    var output  = '<li class="lesson lesson--item">';
        output +=   '<a href="" class="lesson__link" data-key="' + _id + '">' + title + '</a>';
        output +=   '<span id="deleteLesson" style="margin-left: 1em;" data-key="' + _id + '">X</span>'
        output += '</li>';

    $('#lessons-list').append(output);
  }
}

function displaySingleLesson(lesson) {
  var title        = '<h3 class="lesson__title">' + lesson.title + '</h3>';
  var objective    = '<p class="lesson__objective"><strong>Objective: </strong>' + lesson.objective + '</p>';
  var dueDate      = '<p class="lesson__due"><strong>Due: </strong>' + lesson.dueDate + '</p>';
  var instructions = '<p class="lesson__instructions"><strong>Instructions: </strong>' + lesson.instructions + '</p>';
  var text         = '<div class="lesson__text" contenteditable="true">' + lesson.text + '</div>';
  var editBtn      = '<button id="editLesson" type="submit" data-key="' + lesson._id + '">Edit</button>';

  var output  = '<article class="lesson lesson--single">';
      output +=   title;
      output +=   (lesson.objective !== '') ? objective: '';
      output +=   (lesson.dueDate !== '') ? dueDate: '';
      output +=   (lesson.instructions !== '') ? instructions : '';
      output +=   text;
      output +=   editBtn;
      output += '</article>';

  $('#lesson').html(output);
}


/*********
 * Add
 *********/
function displayCourseForm(id) {
  var btnId   = ($(this).attr('id') === 'editCourse') ? 'saveEditCourse' : 'submitCourse';

  var output  = '<form id="courseForm">';
      output +=   '<label for="courseTitle">Course Title (required)<input id="courseTitle" type="text" required></label>';
      output +=   '<label for="instructor">Instructor (required)<input id="instructor" type="text" required></label>';
      output +=   '<label for="term">Term<input id="term" type="text"></label>';
      output +=   '<label for="description">Description<input id="description" type="text"></label>';
      output +=   '<button id="' + btnId + '" type="submit" data-key="' + id + '">Save</button>';
      output += '</form>';

  $('.course-info').html(output);
}

function addCourse() {
  var course = {
    title       : $('#courseTitle').val(),
    instructor  : $('#instructor').val(),
    term        : $('#term').val(),
    description : $('#description').val()
  };

  $.ajax('/course', {
    type: 'POST',
    data: JSON.stringify(course),
    dataType: 'json',
    contentType: 'application/json'
  })
    .done(function() {
      getAndDisplayCourseInfo();
  });
}

function displayLessonForm(id) {
  var btnId   = ($(this).attr('id') === 'newLesson') ? 'submitLesson' : 'saveEditLesson';

  if ($(this).attr('id') === 'saveEditLesson') {
    console.log(id);

  }

  var output  = '<form id="lessonForm">';
      output +=   '<label for="title">Lesson Title (required)<input id="title" type="text" required></label>';
      output +=   '<label for="objective">Objective<input id="objective" type="text"></label>';
      output +=   '<label for="dueDate">Due Date<input id="dueDate" type="text"></label>';
      output +=   '<label for="instructions">Instructions</label>';
      output +=   '<textarea id="instructions"></textarea>';
      output +=   '<label for="text">Lesson Text (required)</label>';
      output +=   '<textarea id="text" required></textarea>';
      output +=   '<button id="' + btnId + '" type="submit" data-key="' + id + '">Save Lesson</button>';
      output += '</form>';

  $('#lesson').html(output);
}

function addLesson() {
  var lesson = {
    title        : $('#title').val(),
    objective    : $('#objective').val(),
    dueDate      : $('#dueDate').val(),
    instructions : $('#instructions').val(),
    text         : $('#text').val()
  };

  $.ajax('/lessons', {
    type: 'POST',
    data: JSON.stringify(lesson),
    dataType: 'json',
    contentType: 'application/json'
  })
    .done(function() {
      getAndDisplayAllLessons();
    });
}


/**************
 * Edit/Update
 **************/
function editCourse(id) {
  var course = {
    title       : $('#courseTitle').val(),
    instructor  : $('#instructor').val(),
    term        : $('#term').val(),
    description : $('#description').val()
  };

  $.ajax('/course/' + id, {
    type: 'PUT',
    data: JSON.stringify(course),
    dataType: 'json',
    contentType: 'application/json'
  })
    .done(function() {
      getAndDisplayCourseInfo();
  });
}

function editLesson(id) {
  var lesson = {
    title        : $('#title').val(),
    objective    : $('#objective').val(),
    dueDate      : $('#dueDate').val(),
    instructions : $('#instructions').val(),
    text         : $('#text').val()
  };

  $.ajax('/lessons/' + id, {
    type: 'PUT',
    data: JSON.stringify(lesson),
    dataType: 'json',
    contentType: 'application/json'
  })
    .done(function() {
      getAndDisplayAllLessons();
  });
}


/*********
 * Delete
 *********/
function deleteCourse(id) {
  $.ajax('/course/' + id, {
    type: 'DELETE',
    dataType: 'json'
  })
    .done(function() {
      displayCourseForm();
  });
}

function deleteLesson(id) {
  $.ajax('/lessons/' + id, {
    type: 'DELETE',
    dataType: 'json'
  })
    .done(function() {
      getAndDisplayAllLessons();
    });
}


/**************************
 * Call promised functions
 **************************/
function getAndDisplayCourseInfo() {
  getCourseInfo().then(displayCourseInfo);
}

function getAndDisplayAllLessons() {
  getAllLessons().then(displayAllLessons);
}

function getAndDisplaySingleLesson(key) {
  getSingleLesson(key).then(function(lesson) {
    displaySingleLesson(lesson);
  });
}


/*************************
 * Call on document ready
 *************************/
$(function() {
  getAndDisplayCourseInfo();
  getAndDisplayAllLessons();
});
