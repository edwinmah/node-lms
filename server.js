var express = require('express');
var morgan  = require('morgan');


var app = express();
app.use(morgan('combined'));
app.use(express.static('public'));


app.listen(process.env.PORT || 8080);


exports.app = app;
