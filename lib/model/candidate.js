var moment = require('moment');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

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

Candidate.methods.isWinner = function() {
  if (this.isDropped()) {
    return Promise.resolve(false);
  }
  return this.model('Peasant').findById(this.peasant)
    .then((peasant) => {
      var candidate = peasant.getLove();
      return candidate && candidate._id == this._id;
    });
};

Candidate.post('save', function(doc, next) {
  this.model('Vote').find({candidate: doc._id})
    .then((votes) => {
      var arr = votes.map(vote => vote.setPoints());
      return Promise.all(arr);
    })
    .catch(next)
    .then(() => {
      next();
    });
});

Candidate.pre('remove', function(next) {
  this.model('Vote').remove({candidate: this._id}, next);
});

module.exports = mongoose.model('Candidate', Candidate);
