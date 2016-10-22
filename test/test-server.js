global.DATABASE_URL = 'mongodb://localhost/node-lms';

var chai     = require('chai');
var chaiHttp = require('chai-http');
var server   = require('../server.js');
var Course   = require('../models/course');
var Lesson   = require('../models/lesson');
var should   = chai.should();
var app      = server.app;
var storage  = server.storage;


chai.use(chaiHttp);


describe('index page', function() {
  /****************************
   * Create & remove test data
   ****************************/
  before(function(done) {
    server.runServer(function() {
      Course.create(
        {
          instructor  : 'Edwin Mah',
          term        : 'Spring 2017',
          title       : 'COMM 603',
          description : 'A class for MFA and MA film students'
        }
        function() {
          done();
      });

      Lesson.create(
        {
          title        : 'Course introduction',
          objective    : 'Lesson Objective',
          dueDate      : '2017-04-01',
          instructions : 'Lesson instructions',
          text         : 'Click here to edit this text'
        }, {
          title        : 'Download and install software',
          objective    : '',
          dueDate      : '2017-04-8',
          instructions : '',
          text         : 'Click here to edit this text'
        }, {
          title        : 'About me page',
          objective    : 'Lesson Objective',
          dueDate      : '2017-04-15',
          instructions : 'Lesson instructions',
          text         : 'Click here to edit this text'
        }, {
          title        : 'Do something else',
          objective    : 'Lesson Objective',
          dueDate      : '2017-04-22',
          instructions : '',
          text         : 'Click here to edit this text'
        },
        function() {
          done();
      });
    });
  });

  after(function(done) {
    Course.remove(function() {
      done();
    });
    Lesson.remove(function() {
      done();
    });
  });

  /************
   * Run tests
   ************/
  it('index page loads', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });

  it('login page loads', function(done) {
    chai.request(app)
      .get('/login.html')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });

  it('lesson page loads', function(done) {
    chai.request(app)
      .get('/lesson.html')
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });
}); // end describe
