var COURSE = {
  "instructor": "Edwin Mah",
  "term": "Spring 2017",
  "title": "Nullam id dolor id nibh ultricies vehicula ut id elit.",
  "description": "Vestibulum id ligula porta felis euismod semper. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus."
};

var LESSON_DATA = {
  "lessons": [
    {
      "_id": "1111111",
      "title": "Maecenas faucibus mollis interdum",
      "objective": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "dueDate": "2016-12-01",
      "submissionInstructions": "Vestibulum id ligula porta felis euismod semper. Etiam porta sem malesuada magna mollis euismod. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
      "text": "Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus."
    },
    {
      "_id": "2222222",
      "title": "Nullam id dolor id nibh ultricies",
      "objective": "Nulla vitae elit libero, a pharetra augue.",
      "dueDate": "2016-12-08",
      "submissionInstructions": "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
      "text": "Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Vestibulum id ligula porta felis euismod semper. Donec id elit non mi porta gravida at eget metus."
    },
    {
      "_id": "333333",
      "title": "Morbi leo risus, porta ac consectetur",
      "objective": "Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
      "dueDate": "2016-12-15",
      "submissionInstructions": "Vestibulum id ligula porta felis euismod semper. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
      "text": "Cras mattis consectetur purus sit amet fermentum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod."
    },
    {
      "_id": "4444444",
      "title": "Nulla vitae elit libero, a pharetra augue",
      "objective": "Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
      "dueDate": "2016-12-22",
      "submissionInstructions": "Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
      "text": "Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Nulla vitae elit libero, a pharetra augue."
    }
  ]
};

var currentLesson = {
  index: null
}


/*********
 * Events
 *********/
$('#login').submit(function(event) {
  event.preventDefault();
  console.log('login occurred');
});

$('#course-lessons').on('click', '.lesson__link', function(event) {
  event.preventDefault();
  getAndDisplaySingleLesson.call(this);
});


/***********
 * Get data
 ***********/
function getCourseInfo() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() { resolve(COURSE) }, 100);
  });
}

function getAllLessons() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() { resolve(LESSON_DATA) }, 100);
  });
}


function getSingleLesson() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() { resolve(LESSON_DATA) }, 100);
  });
}


/***************
 * Display data
 **************/
function displayCourseInfo(data) {
  $('.course__title').text(data.title);
  $('.course__desc').text(data.description);
  $('.course__instructor').text(data.instructor);
  $('.course__term').text(data.term);
}

function displayAllLessons(data) {
  for (index in data.lessons) {
    var title   = data.lessons[index].title;
    var dueDate = data.lessons[index].dueDate;

    var output  = '<li class="lesson lesson--item">';
        output +=   '<a href="" class="lesson__link" data-key="' + index + '">' + title + '</a>';
        output += '</li>';

    $('#lessons-list').append(output);
  }
}

function editSingleLesson(data) {
  $('#lesson').on('focus', '[contenteditable="true"]', function() {
    $(this).data('initialtext', $(this).text());
    console.log('The content was focused.');
  })
    .on('blur', '[contenteditable="true"]', function() {
    if ($(this).data('initialtext') !== $(this).text()) {
      console.log('The content was changed.');
      //console.log($(this).text());
      data.lessons[currentLesson.index].text = $(this).text();
    }
  });
}

function displaySingleLesson(data) {
  currentLesson.index = $(this).data('key');
//  console.log(index);
//  console.log($(this));

  var title      = data.lessons[currentLesson.index].title;
  var objective  = data.lessons[currentLesson.index].objective;
  var dueDate    = data.lessons[currentLesson.index].dueDate;
  var submission = data.lessons[currentLesson.index].submissionInstructions;
  var text       = data.lessons[currentLesson.index].text;

  var output  = '<article class="lesson lesson--single">';
      output +=   '<h3 class="lesson__title">' + title + '</h3>';
      output +=   '<p><strong>Objective: </strong>' + objective + '</p>';
      output +=   '<p><strong>Due: </strong>' + dueDate + '</p>';
      output +=   '<p contenteditable="true">' + text + '</p>';
      output += '</article>';

  $('#lesson').html(output);

  console.log(text);
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

function getAndDisplaySingleLesson() {
  getSingleLesson().then(editSingleLesson)
                   .then(displaySingleLesson.call(this, LESSON_DATA));
}


/*************************
 * Call on document ready
 *************************/
$(function() {
  getAndDisplayCourseInfo();
  getAndDisplayAllLessons();
});
