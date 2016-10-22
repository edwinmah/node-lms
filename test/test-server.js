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

  it('should add a course on POST', function(done) {
    chai.request(app)
      .post('/course')
      .send({
              instructor  : 'Someone else',
              term        : 'Summer 2017',
              title       : 'COMM 553',
              description : 'A description for COMM 553'
            })
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('instructor');
        res.body.should.have.property('term');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('_id');
        res.body.instructor.should.be.a('string');
        res.body.term.should.be.a('string');
        res.body.title.should.be.a('string');
        res.body.description.should.be.a('string');
        res.body._id.should.be.a('string');
        res.body.instructor.should.equal('Someone else');
        res.body.term.should.equal('Summer 2017');
        res.body.title.should.equal('COMM 553');
        res.body.description.should.equal('A description for COMM 553');
        done();
      });
  });

  it('should add a lesson on POST', function(done) {
    chai.request(app)
      .post('/lessons')
      .send({
              title        : 'Another lesson',
              objective    : 'Lesson Objective',
              dueDate      : '2017-04-29',
              instructions : 'Lesson instructions',
              text         : 'Some text for another lesson'
            })
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('title');
        res.body.should.have.property('objective');
        res.body.should.have.property('dueDate');
        res.body.should.have.property('instructions');
        res.body.should.have.property('text');
        res.body.should.have.property('_id');
        res.body.title.should.be.a('string');
        res.body.objective.should.be.a('string');
        res.body.dueDate.should.be.a('string');
        res.body.instructions.should.be.a('string');
        res.body.text.should.be.a('string');
        res.body._id.should.be.a('string');
        res.body.title.should.equal('Another lesson');
        res.body.objective.should.equal('Lesson Objective');
        res.body.dueDate.should.equal('2017-04-29');
        res.body.instructions.should.equal('Lesson instructions');
        res.body.text.should.equal('Some text for another lesson');
        done();
      });
  });

  it('should edit a course on PUT', function(done) {
    chai.request(app)
      .get('/course')
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(200);
        chai.request(app)
          .put('/course/' + res.body[0]._id)
          .send({ instructor: 'Donald Duck' })
          .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            chai.request(app)
              .get('/course')
              .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(2);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('instructor');
                res.body[0].should.have.property('title');
                res.body[0]._id.should.be.a('string');
                res.body[0].instructor.should.be.a('string');
                res.body[0].instructor.should.equal('Donald Duck');
                done();
              });
          });
      });
  });

  it('should edit a lesson on PUT', function(done) {
    chai.request(app)
      .get('/lessons')
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(200);
        chai.request(app)
          .put('/lessons/' + res.body[0]._id)
          .send({ title: 'Just another lesson title' })
          .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            chai.request(app)
              .get('/lessons')
              .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(5);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('objective');
                res.body[0].should.have.property('dueDate');
                res.body[0].should.have.property('instructions');
                res.body[0].should.have.property('text');
                res.body[0]._id.should.be.a('string');
                res.body[0].title.should.be.a('string');
                res.body[0].title.should.equal('Just another lesson title');
                done();
              });
          });
      });
  });
}); // end describe
