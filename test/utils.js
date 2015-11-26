'use strict';

var config = require('../config');
var mongoose = require('mongoose');

process.env.NODE_ENV = 'test';

before((done) => {

  var clearDB = function() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
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
