var $         = require('jquery');
var dragula   = require('dragula');
var marked    = require('marked');
var SimpleMDE = require('simplemde');
var magnificPopup = require('magnific-popup');
require('magnific-popup/dist/magnific-popup.css')
require('normalize.css/normalize.css');
require('dragula/dist/dragula.min.css');
require('simplemde/dist/simplemde.min.css');
require('../src/style.css');


var ICONS = {
  edit   : '<svg class="icon icon-edit" aria-labelledby="title desc" role="img"><use xlink:href="#icon-edit"></use></svg>',
  delete : '<svg class="icon icon-trash" aria-labelledby="title desc" role="img"><use xlink:href="#icon-trash"></use></svg>'
};

$(function () {
  $('.popup-modal').magnificPopup({
    type: 'inline',
    preloader: false,
    modal: true
  });
  $(document).on('click', '.popup-modal-dismiss', function(event) {
    event.preventDefault();
    $.magnificPopup.close();
  });
});

function showWelcome() {
  $('.popup-modal').triggerHandler('click');
}

$('.popup-modal-dismiss').on('click', function() {
  var isChecked = $('#showAboutPref').prop('checked');
  if (isChecked) {
    localStorage.setItem('showAboutPref', 'false');
    checkPref();
  } else {
    localStorage.removeItem('showAboutPref');
    unCheckPref();
  }
});

function checkPref() {
  $('#showAboutPref').attr('checked', 'checked');
}

function unCheckPref() {
  $('#showAboutPref').removeAttr('checked');
}

marked.setOptions({
  smartypants: true
});

dragula([document.getElementById('lessons-list')]);


/*********
 * Events
 *********/
$('[role="banner"]').on('click', '#newCourse', function(event) {
  event.preventDefault();
  displayCourseForm.call(this);
});

$('[role="banner"]').on('click', '#submitCourse', function(event) {
  event.preventDefault();
  addCourse.call(this);
});

$('[role="banner"]').on('click', '#editCourse', function(event) {
  event.preventDefault();
  var key = '' + $(this).data('key');
  getCourseInfo.call(this, key).then(displayCourseForm.bind(this, key));
});

$('[role="banner"]').on('click', '#saveEditCourse', function(event) {
  var key = '' + $(this).data('key');
  editCourse.call(this, key);
});

$('[role="banner"]').on('click', '#deleteCourse', function(event) {
  var key = '' + $(this).data('key');
  var isLessonsListEmpty = $('#lessons-list').is(':empty');
  var invalidDeleteMsg   = '<p class="statusMsg alert">Oops! This course still has lessons. Please delete its lessons before deleting this course.<span class="close-alert">&times;</span></p>';

  if (isLessonsListEmpty) {
    deleteCourse(key);
  } else {
    $('.course-info').append(invalidDeleteMsg);
  }
});

$('[role="banner"]').on('click', '.close-alert', function(event) {
  $('.statusMsg').remove();
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
    getCourseInfo().then(function(course) {
    addLesson(course);
  });
});

$('main').on('click', '#editLesson', function(event) {
  event.preventDefault();
  var key = '' + $(this).data('key');
  getSingleLesson.call(this, key).then(displayLessonForm.bind(this, lesson));
});

$('main').on('click', '#saveEditLesson', function(event) {
  event.preventDefault();
  var key = '' + $(this).data('key');
  editLesson(key);
});

$('#lesson').on('click', '#deleteLesson', function(event) {
  var key = '' + $(this).data('key');
  deleteLesson(key);
});


/***********
 * Get data
 ***********/
function getCourseInfo(id) {
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
  if (course.length > 0) {
    $('#course-lessons').show();
  } else {
    $('#course-lessons').hide();
    return;
  }

  var courseTitle  = '<h1 class="course__title">' + course[0].title + '</h1>';
  var editIcon     = '<span id="editCourse" data-key="' + course[0]._id + '">' + ICONS.edit + '</span>';
  var deleteIcon   = '<span id="deleteCourse" data-key="' + course[0]._id + '">' + ICONS.delete + '</span>';
  var instructor   = '<p class="course__instructor"><strong>Instructor:</strong> ' + course[0].instructor + '</p>';
  var term         = '<p class="course__term">' + course[0].term + '</p>';
  var description  = '<p class="course__description">' + course[0].description + '</p>';

  var output  = courseTitle;
      output += instructor;
      output += (course[0].term) ? term : '';
      output += (course[0].description) ? description : '';
      output += '<div class="admin actions">';
      output +=   editIcon;
      output +=   deleteIcon;
      output += '</div>';

  $('.course-info').html(output);
}

function displayAllLessons(lessons) {
  $('#lessons-list').html('');
  for (var index in lessons) {
    var title   = lessons[index].title;
    var _id     = lessons[index]._id;

    var output  = '<li class="lesson lesson--item">';
        output +=   '<a href="" class="lesson__link" data-key="' + _id + '">' + title + '</a>';
        output += '</li>';

    $('#lessons-list').append(output);
  }
}

function displaySingleLesson(lesson) {
  var title        = '<h2 class="lesson__title">' + lesson.title + '</h2>';
  var objective    = '<p class="lesson__objective"><strong>Objective: </strong>' + lesson.objective + '</p>';
  var dueDate      = '<p class="lesson__due"><strong>Due: </strong>' + lesson.dueDate + '</p>';
  var instructions = '<p class="lesson__instructions"><strong>Instructions: </strong>' + lesson.instructions + '</p>';
  var text         = '<div class="lesson__text">' + marked(lesson.text) + '</div>';
  var editIcon     = '<span id="editLesson"   data-key="' + lesson._id + '">' + ICONS.edit   + '</span>';
  var deleteIcon   = '<span id="deleteLesson" data-key="' + lesson._id + '">' + ICONS.delete + '</span>';

  var output  = '<article class="lesson lesson--single">';
      output +=   title;
      output +=   (lesson.objective    !== '') ? objective    : '';
      output +=   (lesson.dueDate      !== '') ? dueDate      : '';
      output +=   (lesson.instructions !== '') ? instructions : '';
      output +=   text;
      output +=   '<div class="admin actions">';
      output +=     editIcon;
      output +=     deleteIcon;
      output +=   '</div>';
      output += '</article>';

  $('#lesson').html(output);
}

function displayRecentLesson() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve($('#course-lessons').find('.lesson__link').last().trigger('click'));
    }, 100);
  });
}

function autoDisplayLessonForm() {
  var isLessonsListEmpty = $('#lessons-list').is(':empty');
  if (isLessonsListEmpty) {
    $('#newLesson').trigger('click');
  }
}


/*********
 * Add
 *********/
function displayCourseForm(id, course) {
  var edit        = $(this).attr('id') === 'editCourse';
  var btnId       = (edit) ? 'saveEditCourse'      : 'submitCourse';
  var title       = (edit) ? course[0].title       : '';
  var instructor  = (edit) ? course[0].instructor  : '';
  var term        = (edit) ? course[0].term        : '';
  var description = (edit) ? course[0].description : '';

  var output  = '<form id="courseForm">';
      output +=   '<label for="courseTitle">Course Title (required)<input id="courseTitle" type="text" value="' + title + '" required></label>';
      output +=   '<label for="instructor">Instructor (required)<input id="instructor" type="text" value="' + instructor + '" required></label>';
      output +=   '<label for="term">Term<input id="term" type="text" value="' + term + '"></label>';
      output +=   '<label for="description">Description<input id="description" type="text" value="' +  description + '"></label>';
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

function displayLessonForm(id, lesson) {
  var edit          = $(this).attr('id') === 'editLesson';
  var btnId         = (edit) ? 'saveEditLesson'    : 'submitLesson';
  var id            = (edit) ? lesson._id          : '';
  var title         = (edit) ? lesson.title        : '';
  var objective     = (edit) ? lesson.objective    : '';
  var dueDate       = (edit) ? lesson.dueDate      : '';
  var instructions  = (edit) ? lesson.instructions : '';
  var text          = (edit) ? lesson.text         : '';

  var output  = '<form id="lessonForm">';
      output +=   '<label for="title">Lesson Title (required)<input id="title" type="text" value="' + title + '" required></label>';
      output +=   '<label for="objective">Objective<input id="objective" type="text" value="' + objective + '"></label>';
      output +=   '<label for="dueDate">Due Date<input id="dueDate" type="text" value="' + dueDate + '"></label>';
      output +=   '<label for="instructions">Instructions</label>';
      output +=   '<textarea id="instructions">' + instructions + '</textarea>';
      output +=   '<label for="text">Lesson Text (required)</label>';
      output +=   '<textarea id="text" required>' + text + '</textarea>';
      output +=   '<button id="' + btnId + '" type="submit" data-key="' + id + '">Save Lesson</button>';
      output += '</form>';

  $('#lesson').html(output);
  simpleMarkdown();
}

function simpleMarkdown() {
  setTimeout(function() {
    new SimpleMDE({
      element: document.getElementById('text'),
      forceSync: true,
      indentWithTabs: false
    });
  }, 0);
}

function addLesson(course) {
  var lesson = {
    courseId     : (course[0]) ? course[0]._id : '',
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
    .done(function(newLesson) {
      getAndDisplayAllLessons();
      getAndDisplaySingleLesson(newLesson._id);
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
      getAndDisplaySingleLesson(id);
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
      displayRecentLesson().then(autoDisplayLessonForm);
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
  if (localStorage.getItem('showAboutPref') !== 'false') {
    showWelcome();
    unCheckPref();
  } else {
    checkPref();
  }

  getAndDisplayCourseInfo();
  getAndDisplayAllLessons();
});
