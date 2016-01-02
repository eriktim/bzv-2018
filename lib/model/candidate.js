var moment = require('moment');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var util = require('../util');

var Candidate = new Schema({
  name: {
    type: String,
    required: true
  },
  peasant: {
    type: Schema.Types.ObjectId,
    ref: 'Peasant',
    required: true
  },
  dropped: {
    type: Date,
  },
  winner: {
    type: Boolean
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

Candidate.methods.isDropped = function(period) {
  if (period && this.dropped) {
    var dropped = moment(this.dropped);
    return dropped.isAfter(period.start) &&
        dropped.isBefore(period.reference);
  }
  return !!this.dropped;
};

Candidate.post('save', function(doc, next) {
  return util.update({candidate: doc.id})
    .then(next);
});

Candidate.pre('remove', function(next) {
  this.model('Vote').remove({candidate: this._id}, next);
});

module.exports = mongoose.model('Candidate', Candidate);
