'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var morgan = require('morgan');

var config = require('./config');
var setup = require('./setup');
var auth = require('./lib/api/auth');
var candidate = require('./lib/api/candidate');
var peasant = require('./lib/api/peasant');
var period = require('./lib/api/period');
var user = require('./lib/api/user');
var vote = require('./lib/api/vote');

var verbose = process.env.NODE_ENV != 'test';

var app = express();
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
if (verbose) {
  app.use(morgan('dev'));
}

var mongoPath = config.db[process.env.NODE_ENV || 'dev'];
mongoose.connect(mongoPath, (err) => {
  if (err) {
    console.error(err);
  } else if (verbose) {
    console.log('connected to ' + mongoPath);
  }
});

var port = config.port[process.env.NODE_ENV || 'dev'];

var router = express.Router();

auth.bind(router);
candidate.bind(router);
peasant.bind(router);
period.bind(router);
user.bind(router);
vote.bind(router);

router.use((req, res, next) => {
  res.json({message: 'not found'}, 404);
});

setup.bind(app);

app.use('/api', router);

app.use((req, res, next) => {
  res.sendfile('index.html', {root: './static'});
});

app.listen(port);
var url = 'http://localhost:' + port;
if (verbose) {
  console.log('running on ' + url);
}
exports.url = url + '/api/';
