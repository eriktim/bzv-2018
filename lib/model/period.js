var moment = require('moment');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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
  numberOfVotes: { // TODO add check for love/good
    type: Number,
    required: true,
    min: 1
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

Period.pre('validate', function(next) {
  if (moment(this.start).isAfter(this.end)) {
    next(new Error('period cannot end before starting'));
  } else if (this.reference && moment(this.reference).isBefore(this.end)) {
    next(new Error('period cannot end before the reference'));
  } else {
    next();
  }
});

Period.post('save', function(doc, next) {
  this.model('Vote').find({period: doc._id})
    .then((votes) => {
      var arr = votes.map(vote => vote.setPoints());
      return Promise.all(arr);
    })
    .catch(next)
    .then(() => {
      next();
    });
});

Period.pre('remove', function(next) {
  this.model('Vote').remove({period: this._id}, next);
});

module.exports = mongoose.model('Period', Period);
