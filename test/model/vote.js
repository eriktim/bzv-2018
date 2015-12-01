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

  before(() => {
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
    return Peasant.create(peasant)
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
      });
  });

  it('should create a Vote', () => {
    var vote = {
      candidate: myCandidateA._id,
      period: myPeriod._id,
      user: myUser._id,
      type: 'love'
    };
    return Vote.create(vote)
      .then((vote) => {
        expect(vote.candidate).to.equal(myCandidateA._id);
        expect(vote.period).to.equal(myPeriod._id);
        expect(vote.user).to.equal(myUser._id);
        expect(vote.type).to.equal('love');
        expect(vote.updated).to.be.a('Date');
      });
  });

  it('should create another Vote', () => {
    var vote = {
      candidate: myCandidateB._id,
      period: myPeriod._id,
      user: myUser._id,
      type: 'good'
    };
    return Vote.create(vote)
      .then((vote) => {
        expect(vote.candidate).to.equal(myCandidateB._id);
        expect(vote.period).to.equal(myPeriod._id);
        expect(vote.user).to.equal(myUser._id);
        expect(vote.type).to.equal('good');
        expect(vote.updated).to.be.a('Date');
      });
  });

  it('should have Votes', () => {
    return Vote.find()
      .then((votes) => {
        expect(votes.length).to.equal(2);
      });
  });

  it('should edit a Vote', () => {
    return Vote.findOne()
      .then((vote) => {
        vote.type = 'bad';
        return vote.save();
      })
      .then((vote) => {
        expect(vote.type).to.equal('bad');
        expect(vote.updated).to.be.a('Date');
      });
  });

  it('should delete all Votes', () => {
    return Vote.remove();
  });

  it('should not have Votes', () => {
    return Vote.find()
      .then((votes) => {
        expect(votes.length).to.equal(0);
      });
  });

  describe('should have restrictions', () => {

    var candidateA;
    var candidateB;
    var peasant;
    var period;
    var user;

    before(() => {
      return Promise.all([
        Candidate.remove(),
        Peasant.remove(),
        Period.remove(),
        User.remove(),
        Vote.remove()
      ])
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
          Peasant.find(),
          Candidate.find(),
          User.find()
        ]);
      })
      .then((values) => {
        expect(values[0].length).to.equal(1);
        expect(values[1].length).to.equal(2);
        expect(values[2].length).to.equal(1);
      });
    });

    it('should vote within a period', () => {
      var failed = false;
      return Period.create({
        year: 2000,
        start: moment().subtract(1, 'week'),
        end: moment().subtract(1, 'day'),
        numberOfVotes: 1
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
        failed = true;
      })
      .then(() => {
        expect(failed).to.be.true;
      });
    });

    it('should vote only once', () => {
      var checkPoints = 0;
      return Period.create({
        year: 2000,
        start: moment().subtract(1, 'day'),
        end: moment().add(1, 'day'),
        numberOfVotes: 1
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
      });
    });

    after(() => {
      return Candidate.remove()
        .then(() => {
          return Promise.all([
            Peasant.remove(),
            Period.remove()
          ]);
        });
    });

  });

});
