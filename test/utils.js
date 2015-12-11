'use strict';

process.env.NODE_ENV = 'test';

var fetch = require('node-fetch');
var formurlencoded = require('form-urlencoded');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var User = require('../lib/model/user');
var config = require('../config');
var server = require('../lib/api/server');

var userId;
var token;

var createRequestHandler = function(method) {
  var obj = {method: method};
  return function(data) {
    var headers = {};
    if (token) {
      headers['x-access-token'] = token;
    }
    if (['POST', 'PUT'].indexOf(method) >= 0) {
      headers['content-type'] = 'application/x-www-form-urlencoded';
      obj.body = formurlencoded.encode(data);
    }
    obj.headers = headers;
    return obj;
  };
};

exports.get = createRequestHandler('GET');
exports.post = createRequestHandler('POST');
exports.put = createRequestHandler('PUT');
exports.delete = createRequestHandler('DELETE');
exports.url = server.url;
exports.userId = function() {return userId;};

before(() => {

  return new Promise((resolve) => {
    var clearDatabase = function() {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(() => {});
      }
      User.create({
        year: 2000,
        name: 'admin',
        email: 'admin@bzv.js',
        hash: 'password',
        role: 'admin'
      })
      .then((user) => {
        userId = user._id.toString();
        return fetch(server.url + 'authenticate',
            exports.post({name: 'admin', password: 'password'}));
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error('failed obtaining token');
        }
        return res.json();
      })
      .then((data) => {
        token = data.token;
        resolve();
      })
      .catch(console.error);
    };

    if (mongoose.connection.readyState === 0) {
      mongoose.connect(config.db.test, (err) => {
        if (err) {
          throw err;
        }
        clearDatabase();
      });
    } else {
      clearDatabase();
    }
  });

});

after(() => {

  mongoose.disconnect();

});
