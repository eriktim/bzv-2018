'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var moment = require('moment');

var Candidate = require('../../lib/model/candidate');
var Peasant = require('../../lib/model/peasant');
var Period = require('../../lib/model/period');
var User = require('../../lib/model/user');
var Vote = require('../../lib/model/vote');

describe('Vote Model', () => {

  var myPeasant;
  var myCandidateA;
  var myCandidateB;
  var myPeriod;
  var myUser;

  before((done) => {
    var year = 2000;
    var peasant = {
      year: year,
      name: 'Peasant'
    };
    var candidateA = {
      name: 'CandidateA'
    };
    var candidateB = {
      name: 'CandidateB'
    };
    var user = {
      year: year,
      name: 'User',
      email: 'user@bzv.js',
      hash: '$hash',
      role: 'user'
    };
    var period = {
      year: year,
      start: moment().subtract(1, 'day'),
      end: moment().add(1, 'day'),
      numberOfVotes: 3
    };
    Peasant.create(peasant)
      .then((peasant) => {
        myPeasant = peasant;
        candidateA.peasant = peasant._id;
        candidateB.peasant = peasant._id;
        return Promise.all([
          Candidate.create(candidateA),
          Candidate.create(candidateB)
        ]);
      })
      .then((candidates) => {
        myCandidateA = candidates.shift();
        myCandidateB = candidates.shift();
        return User.create(user);
      })
      .then((user) => {
        myUser = user;
        return Period.create(period);
      })
      .then((period) => {
        myPeriod = period;
        done();
      });
  });

  it('should create a Vote', (done) => {
    var vote = {
      candidate: myCandidateA._id,
      period: myPeriod._id,
      user: myUser._id,
      type: 'love'
    };
    Vote.create(vote)
      .then((vote) => {
        expect(vote.candidate).to.equal(myCandidateA._id);
        expect(vote.period).to.equal(myPeriod._id);
        expect(vote.user).to.equal(myUser._id);
        expect(vote.type).to.equal('love');
        expect(vote.updated).to.be.a('Date');
        done();
      });
  });

  it('should create another Vote', (done) => {
    var vote = {
      candidate: myCandidateB._id,
      period: myPeriod._id,
      user: myUser._id,
      type: 'good'
    };
    Vote.create(vote)
      .then((vote) => {
        expect(vote.candidate).to.equal(myCandidateB._id);
        expect(vote.period).to.equal(myPeriod._id);
        expect(vote.user).to.equal(myUser._id);
        expect(vote.type).to.equal('good');
        expect(vote.updated).to.be.a('Date');
        done();
      });
  });

  it('should have Votes', (done) => {
    Vote.find().exec()
      .then((votes) => {
        expect(votes.length).to.equal(2);
        done();
      });
  });

  it('should edit a Vote', (done) => {
    Vote.findOne().exec()
      .then((vote) => {
        vote.type = 'bad';
        return vote.save();
      })
      .then((vote) => {
        expect(vote.type).to.equal('bad');
        expect(vote.updated).to.be.a('Date');
        done();
      });
  });

  it('should delete all Votes', (done) => {
    Vote.find().remove()
      .then(() => {
        done();
      });
  });

  it('should not have Votes', (done) => {
    Vote.find()
      .then((votes) => {
        expect(votes.length).to.equal(0);
        done();
      });
  });

  describe('should have restrictions', () => {

    var candidateA;
    var candidateB;
    var peasant;
    var period;
    var user;

    before((done) => {
      Promise.resolve()
        .then(() => {
          return Promise.all([
            Candidate.remove().exec(),
            Peasant.remove().exec(),
            Period.remove().exec(),
            User.remove().exec(),
            Vote.remove().exec()
          ]);
        })
        .then(() => {
          return Peasant.create({
            year: 2000,
            name: 'Peasant'
          });
        })
        .then((res) => {
          peasant = res;
          return Promise.all([
            Candidate.create({
              name: 'CandidateA',
              peasant: peasant._id
            }),
            Candidate.create({
              name: 'CandidateB',
              peasant: peasant._id
            })
          ]);
        })
        .then((values) => {
          candidateA = values.shift();
          candidateB = values.shift();
          return User.create({
            year: 2000,
            name: 'User',
            email: 'user@bzv.js',
            hash: '$hash',
          });
        })
        .then((res) => {
          user = res;
          return Promise.all([
            Peasant.find().exec(),
            Candidate.find().exec(),
            User.find().exec()
          ]);
        })
        .then((values) => {
          expect(values[0].length).to.equal(1);
          expect(values[1].length).to.equal(2);
          expect(values[2].length).to.equal(1);
        })
        .then(() => {
          done();
        });
    });

    it('should vote within a period', (done) => {
      Promise.resolve()
      .then(() => {
        return Period.create({
          year: 2000,
          start: moment().subtract(1, 'week'),
          end: moment().subtract(1, 'day'),
          numberOfVotes: 1
        });
      })
      .then((period) => {
        return Vote.create({
          candidate: candidateA._id,
          period: period._id,
          user: user._id,
          type: 'love'
        });
      })
      .catch((reason) => {
        expect(reason.toString()).to.equal(
            'Error: voting period has been closed');
        done();
      });
    });

    it('should vote only once', (done) => {
      var checkPoints = 0;
      Promise.resolve()
        .then(() => {
          return Period.create({
            year: 2000,
            start: moment().subtract(1, 'day'),
            end: moment().add(1, 'day'),
            numberOfVotes: 1
          });
        })
        .then((res) => {
          period = res;
          return Vote.create({
            candidate: candidateA._id,
            period: period._id,
            user: user._id,
            type: 'love'
          });
        })
        .then(() => {
          checkPoints++;
          return Vote.create({
            candidate: candidateA._id,
            period: period._id,
            user: user._id,
            type: 'good'
          });
        })
        .catch((reason) => {
          expect(reason.toString()).to.equal('Error: votes must be unique');
          checkPoints++;
        })
        .then(() => {
          return Vote.create({
            candidate: candidateB._id,
            period: period._id,
            user: user._id,
            type: 'bad'
          });
        })
        .then(() => {
          checkPoints++;
          expect(checkPoints).to.equal(3);
          done();
        });
    });

    after((done) => {
      Candidate.find().remove().exec()
        .then(() => {
          return Promise.all([
            Peasant.find().remove().exec(),
            Period.find().remove().exec()
          ]);
        })
        .then(() => {
          done();
        });
    });

  });

});
