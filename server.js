'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var config = require('./config');
var candidate = require('./lib/rest/candidate');
var peasant = require('./lib/rest/peasant');

var app = express();
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var verbose = process.env.NODE_ENV != 'test';

var mongoPath = config.db[process.env.NODE_ENV || 'dev'];
mongoose.connect(mongoPath, (err) => {
  if (verbose) {
    if (err) {
      console.error(err);
    } else {
      console.log('connected to ' + mongoPath);
    }
  }
});

var port = config.port[process.env.NODE_ENV || 'dev'];

var router = express.Router();

router.use((req, res, next) => {
  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (verbose) {
    console.log(req.method + ' ' + url);
  }
  next();
});

candidate.bind(router);
peasant.bind(router);

router.use((req, res, next) => {
  res.status(404).json({message: 'not found', status: 404});
});

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
