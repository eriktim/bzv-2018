var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Period = new Schema({
  year: {
    type: Number,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  reference: {
    type: Date
  },
  numberOfVotes: {
    type: Number,
    required: true,
    min: 1
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Period', Period);
