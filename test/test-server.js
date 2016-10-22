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
        },
        function() {
          done();
        });
    });
  });

  before(function(done) {
    server.runServer(function() {
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
  });

  after(function(done) {
    Lesson.remove(function() {
      done();
    });
  });

  /************
   * Run tests
   ************/
  it('should load', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });

  it('should list the lessons on GET', function(done) {
    chai.request(app)
      .get('/lessons')
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.length(4);
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title');
        res.body[0].title.should.be.a('string');
        res.body[0].title.should.equal('Course introduction');
        res.body[1].title.should.equal('Download and install software');
        res.body[2].title.should.equal('About me page');
        res.body[3].title.should.equal('Do something else');
        done();
      });
  });

  it('should display course on GET', function(done) {
    chai.request(app)
      .get('/course')
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.length(1);
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title');
        res.body[0].title.should.be.a('string');
        res.body[0].title.should.equal('COMM 603');
        done();
      });
  });
}); // end describe
