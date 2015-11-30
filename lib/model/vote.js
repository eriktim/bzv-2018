var moment = require('moment');
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

Vote.pre('validate', function(next) {
  this.model('Vote').find({
    candidate: this.candidate,
    period: this.period,
    user: this.user
  }).exec()
  .then((votes) => {
    var vote = votes.find(vote => vote._id == this.id);
    if (votes.length > (vote ? 1 : 0)) {
      next(new Error('votes must be unique'));
    } else {
      return this.model('Period').findOne({_id: this.period}).exec();
    }
  })
  .then((period) => {
    if (moment(period.end) < moment()) {
      next(new Error('voting period has been closed'));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model('Vote', Vote);
