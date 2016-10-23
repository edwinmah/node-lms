/*********
 * Events
 *********/
$('#login').submit(function(event) {
  event.preventDefault();
  console.log('login occurred');
});

$('#course-lessons').on('click', '.lesson__link', function(event) {
  event.preventDefault();
  var key = '' + $(this).data('key');
  getAndDisplaySingleLesson(key);
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
  $('.course__title').text(course[0].title);
  $('.course__desc').text(course[0].description);
  $('.course__instructor').text(course[0].instructor);
  $('.course__term').text(course[0].term);
}

function displayAllLessons(lessons) {
  $('#lessons-list').html('');
  for (index in lessons) {
    var title   = lessons[index].title;
    var dueDate = lessons[index].dueDate;
    var _id     = lessons[index]._id;

    var output  = '<li class="lesson lesson--item">';
        output +=   '<a href="" class="lesson__link" data-key="' + _id + '">' + title + '</a>';
        output += '</li>';

    $('#lessons-list').append(output);
  }
}

function editSingleLesson(lesson) {
  $('#lesson').off();
  $('#lesson').on('focus', '[contenteditable="true"]', function() {
    $(this).data('initialtext', $(this).text());
    console.log('The content was focused.');
  })
    .on('blur', '[contenteditable="true"]', function() {
      if ($(this).data('initialtext') !== $(this).text()) {
        console.log('The content was changed.');
        lesson.text = $(this).text();
      }
    });
}

function displaySingleLesson(lesson) {
  var title      = lesson.title;
  var objective  = lesson.objective;
  var dueDate    = lesson.dueDate;
  var submission = lesson.submissionInstructions;
  var text       = lesson.text;

  var output  = '<article class="lesson lesson--single">';
      output +=   '<h3 class="lesson__title">' + title + '</h3>';
      output +=   '<p><strong>Objective: </strong>' + objective + '</p>';
      output +=   '<p><strong>Due: </strong>' + dueDate + '</p>';
      output +=   '<p contenteditable="true">' + text + '</p>';
      output += '</article>';

  $('#lesson').html(output);
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
    editSingleLesson(lesson);
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
