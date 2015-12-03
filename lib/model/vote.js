var moment = require('moment');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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
  points: {
    type: Number,
    default: 0
  },
  bonusPoints: {
    type: Number,
    default: 0
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

Vote.methods.setPoints = function() {
  var points = 0;
  var bonusPoints = 0;
  return Promise.all([
    this.model('Period').findOne({_id: this.period}),
    this.model('Candidate').findOne({_id: this.candidate})
  ])
  .then((values) => {
    var period = values.shift();
    var candidate = values.shift();
    if (period && period.reference && candidate) {
      var isDropped = candidate.isDropped(period);
      var isBad = this.type == 'bad';
      if (isDropped && isBad || !isDropped && !isBad) {
        points = 1;
      }
      if (this.type == 'love') {
        return candidate.isWinner();
      }
    }
    return false;
  })
  .then((winner) => {
    if (winner) {
      bonusPoints = period.numberOfVotes;
      // TODO no winner bonus
    }
  })
  .then(() => {
    if (this.points != points || this.bonusPoints != bonusPoints) {
      return mongoose.model('Vote').update({_id: this._id}, {
        points: points,
        bonusPoints: bonusPoints
      });
    }
  });
};

Vote.pre('validate', function(next) {
  this.model('Vote').find({
    candidate: this.candidate,
    period: this.period,
    user: this.user
  })
  .then((votes) => {
    var vote = votes.find(vote => vote._id == this.id);
    if (votes.length > (vote ? 1 : 0)) {
      next(new Error('votes must be unique'));
    } else {
      return this.model('Period').findOne({_id: this.period});
    }
  })
  .then((period) => {
    if (moment().isAfter(period.end)) {
      next(new Error('voting period has been closed'));
    } else {
      return this.model('Candidate').findOne({_id: this.candidate});
    }
  })
  .then((candidate) => {
    if (candidate.isDropped()) {
      next(new Error('candidate was already dropped'));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model('Vote', Vote);
