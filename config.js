process.env.NODE_ENV = 'production';

exports.DATABASE_URL = process.env.DATABASE_URL ||
  global.DATABASE_URL ||
  (process.env.NODE_ENV === 'production' ?
   'mongodb://emah:7egK6xGc6[av7a7FL7bVebwy/@ds031597.mlab.com:31597/node-lms' :
   'mongodb://emah:7egK6xGc6[av7a7FL7bVebwy/@ds031597.mlab.com:31597/node-lms-dev');

exports.PORT = process.env.PORT || 8080;
