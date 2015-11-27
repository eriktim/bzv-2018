var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Candidate = new Schema({
  year: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  peasant: {
    type: Schema.Types.ObjectId,
    ref: 'Peasant',
    required: true
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Candidate', Candidate);
