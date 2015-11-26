'use strict';

process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var formurlencoded = require('form-urlencoded');

var config = require('../config');
var server = require('../server');

exports.url = server.url;

var urlEncodedRequest = function(method) {
  return function(data) {
    return {
      method: method,
      body: formurlencoded.encode(data),
      headers: {'content-type': 'application/x-www-form-urlencoded'}
    };
  };
};
exports.post = urlEncodedRequest('POST');
exports.put = urlEncodedRequest('PUT');

before((done) => {

  var clearDB = function() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(() => {});
    }
    return done();
  };

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.db.test, (err) => {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  } else {
    return clearDB();
  }

});

after((done) => {

  mongoose.disconnect();
  return done();

});
