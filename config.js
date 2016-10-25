process.env.NODE_ENV = 'production';

exports.DATABASE_URL = process.env.DATABASE_URL ||
  global.DATABASE_URL ||
  (process.env.NODE_ENV === 'production' ?
   'mongodb://emah:Cx7drCVaLFvGnuiFGT7Mud4R9VJv@ds031597.mlab.com:31597/node_lms' :
   'mongodb://emah:Cx7drCVaLFvGnuiFGT7Mud4R9VJv@ds031597.mlab.com:31597/node_lms-dev');

exports.PORT = process.env.PORT || 8080;
