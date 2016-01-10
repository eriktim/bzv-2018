'use strict';

var bodyParser = require('body-parser');
var compress = require('compression');
var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var morgan = require('morgan');

var config = require('../../config');
var setup = require('./setup');
var auth = require('./auth');
var candidate = require('./candidate');
var peasant = require('./peasant');
var period = require('./period');
var user = require('./user');
var update = require('./update');
var vote = require('./vote');

var verbose = process.env.NODE_ENV != 'test';

var app = express();
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(compress());
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

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

auth.bind(router);
candidate.bind(router);
peasant.bind(router);
period.bind(router);
update.bind(router);
user.bind(router);
vote.bind(router);

router.use((req, res, next) => {
  res.json({message: 'not found'}, 404);
});

setup.bind(app);

app.use('/api', router);
app.use(express.static('static', {index: false, maxAge: 600000}));

app.use((req, res, next) => {
  res.sendfile('index.html', {root: './static'});
});

app.listen(port);
var url = 'http://localhost:' + port;
if (verbose) {
  console.log('running on ' + url);
}
exports.url = url + '/api/';
