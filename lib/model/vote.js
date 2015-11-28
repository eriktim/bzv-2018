var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Vote = new Schema({
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  period: {
    type: Schema.Types.ObjectId,
    ref: 'Period',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['love', 'good', 'bad']
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vote', Vote);
