var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var Peasant = new Schema({
  year: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

Peasant.methods.getLove = function() {
  return this.model('Candidate').find({peasant: this._id})
    .then((candidates) => {
      var winners = candidates.filter(can => !can.isDropped());
      return winners.length == 1 ? winners[0] : undefined;
    });
};

Peasant.pre('remove', function(next) {
  this.model('Candidate').find({peasant: this._id})
    .then((candidates) => {
      var arr = candidates.map(candidate => candidate.remove());
      return Promise.all(arr);
    })
    .then(next);
});

module.exports = mongoose.model('Peasant', Peasant);
