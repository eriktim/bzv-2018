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

Candidate.methods.isDropped = function() {
  return !!this.dropped;
};

Candidate.pre('remove', function(next) {
  this.model('Vote').remove({candidate: this._id}, next);
});

module.exports = mongoose.model('Candidate', Candidate);
