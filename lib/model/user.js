var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  year: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  },
  hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['admin', 'user', 'visitor']
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', User);
