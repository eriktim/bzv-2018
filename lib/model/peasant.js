var mongoose = require('mongoose');
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

Peasant.pre('remove', function(next) {
  this.model('Candidate').find({peasant: this._id})
    .then((candidates) => {
      var dels = [];
      candidates.forEach((candidate) => {
        dels.push(candidate.remove());
      });
      return Promise.all(dels);
    })
    .then(next);
});

module.exports = mongoose.model('Peasant', Peasant);
