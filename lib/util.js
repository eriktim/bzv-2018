var moment = require('moment');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

exports.update = function(filterObj) {
  var filter = filterObj || {};
  var voteCount = 0;
  return Promise.resolve()
    .then(() => {
      var voteFilter = {};
      if (filter.vote) {
        voteFilter._id = filter.vote;
      }
      if (filter.user) {
        voteFilter.user = filter.user;
      }
      if (filter.period) {
        voteFilter.period = filter.period;
      }
      if (filter.candidate) {
        voteFilter.candidate = filter.candidate;
      }
      if (filter.peasant) {
        return mongoose.model('Candidate').find({peasant: filter.peasant})
          .then((candidates) => {
            voteFilter.candidate = {$in: candidates.map(c => c._id)};
            return voteFilter;
          });
      }
      return voteFilter;
    })
    .then((voteFilter) => {
      return mongoose.model('Vote').find(voteFilter);
    })
    .then((votes) => {
      if (!votes.length) {
        throw new Error('could not find any votes');
      }
      voteCount = votes.length;
      var candidateSet = new Set(votes.map(v => v.candidate.toString()));
      var periodSet = new Set(votes.map(v => v.period.toString()));
      var userSet = new Set(votes.map(v => v.user.toString()));
      return mongoose.model('Candidate')
          .find({_id: {$in: Array.from(candidateSet)}})
        .then((candidates) => {
          if (!candidates.length) {
            throw new Error('could not find any candidates');
          }
          var peasantSet = new Set(candidates.map(c => c.peasant.toString()));
          return Promise.all([
            mongoose.model('Peasant')
                .find({_id: {$in: Array.from(peasantSet)}}),
            candidates,
            mongoose.model('Period')
                .find({_id: {$in: Array.from(periodSet)}}),
            mongoose.model('User').find({_id: {$in: Array.from(userSet)}}),
            votes
          ]);
        });
    })
    .then((values) => {
      var peasants = values.shift();
      var candidates = values.shift();
      var periods = values.shift();
      var users = values.shift();
      var votes = values.shift();
      if (!peasants.length) {
        throw new Error('could not find any peasants');
      }
      if (!periods.length) {
        throw new Error('could not find any periods');
      }
      if (!users.length) {
        throw new Error('could not find any users');
      }

      var updates = [];
      peasants.forEach((peasant) => {
        var candidatesPea = candidates.filter(
            c => c.peasant == peasant._id.toString());
        var candidatesInTheRace = candidatesPea.filter(c => !c.dropped);
        var winnerPea = false;
        if (candidatesInTheRace.length === 1) {
          winnerPea = candidatesInTheRace[0];
        }
        periods.forEach((period) => {
          if (!period.end) {
            var upd = mongoose.model('Vote')
                .update({period: period._id.toString()}, {
              points: 0,
              bonusPoints: 0
            });
            updates.push(upd);
            return;
          }
          var votesPer = votes.filter(v => v.period == period._id.toString());
          var start = moment(period.start);
          var reference = moment(period.reference);
          candidatesPea.forEach((candidatePea) => {
            var votedThisPeriod = false;
            var droppedThisPeriod = false;
            var dropped = candidatePea.dropped;
            if (!dropped || start.isBefore(dropped)) {
              votedThisPeriod = true;
              if (reference.isAfter(dropped)) {
                droppedThisPeriod = true;
              }
            }
            var votesPerCan = votesPer.filter(
                v => v.candidate == candidatePea._id.toString());
            votesPerCan.forEach((vote) => {
              var points = 0;
              var bonusPoints = 0;
              if (votedThisPeriod) {
                if ((!droppedThisPeriod &&
                    ['good', 'love'].indexOf(vote.type) >= 0) ||
                    (droppedThisPeriod && vote.type == 'bad')) {
                  points = 1;
                  var voteLove = vote.type == 'love';
                  if (voteLove && winnerPea &&
                      vote.candidate.toString() == winnerPea._id.toString()) {
                    bonusPoints = period.numberOfVotes;
                  }
                }
              }
              var upd = mongoose.model('Vote').update({_id: vote._id}, {
                points: points,
                bonusPoints: bonusPoints
              });
              updates.push(upd);
            });
          });
        });
      });
      return Promise.all(updates)
        .then(() => {
          return updateNoLoveBonus(peasants);
        })
        .then(() => {
          return mongoose.model('Vote')
              .find({user: {$in: users.map(c => c._id)}});
        });
    })
    .then((votes) => {
      var updates = [];
      var userSet = new Set(votes.map(v => v.user.toString()));
      userSet.forEach((userId) => {
        var userVotes = votes.filter(v => v.user.toString() == userId);
        var points = userVotes.reduce((r, v) => r + v.points, 0);
        var bonusPoints = userVotes.reduce((r, v) => r + v.bonusPoints, 0);
        var noLoveBonus = userVotes.reduce((r, v) => r + (v.noLoveBonus ? 1 /* TODO = numberOfVotes */ : 0), 0);
        var upd = mongoose.model('User').update({_id: userId}, {
          points: {
            points: points,
            bonusPoints: bonusPoints,
            noLoveBonus: noLoveBonus,
            totalPoints: points + bonusPoints + noLoveBonus
          }
        });
        updates.push(upd);
      });
      // TODO no-love bonus points
      // TODO split function
      return Promise.all(updates);
    })
    .then(() => {
      return voteCount;
    });
};

var updateNoLoveBonus = function(peasants) {
  var arr = peasants.map((peasant) => {
    return mongoose.model('Candidate').find({peasant: peasant._id})
      .then((candidates) => {
         return mongoose.model('Vote').update({candidate: {$in: candidates.map(c => c._id.toString())}}, {
           noLoveBonus: false
         })
         .then(() => {
           return candidates;
         });
       })
      .then((candidates) => {
         var candidatesInTheRace = candidates.filter(c => !c.dropped);
         if (!candidatesInTheRace.length) {
           var bestCandidate = candidates.sort((a, b) => moment(b.dropped).isAfter(a.dropped))[0];
           return mongoose.model('Vote').find({candidate: {$in: candidates.map(c => c._id.toString())}})
             .then((votes) => {
               var updates = [];
               var periodSet = new Set(votes.map(v => v.period.toString()));
               var userSet = new Set(votes.map(v => v.user.toString()));
               periodSet.forEach((periodId) => {
                 userSet.forEach((userId) => {
                   var loveVote = votes.find(v => v.period == periodId && v.user == userId && v.type == 'love');
                   if (!loveVote) {
                     var upd = mongoose.model('Vote').update({candidate: bestCandidate._id, user: userId, period: periodId}, {
                       noLoveBonus: true
                     });
                     updates.push(upd);
                   }
                 });
               });
               return Promise.all(updates);
             });
         }
      });
  });
  return Promise.all(arr);
};
