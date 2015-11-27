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
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', User);
