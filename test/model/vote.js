'use strict';

var utils = require('../utils');
var expect = require('chai').expect;

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
      start: '2000-01-01', // TODO now -x
      end: '2000-02-01', // TODO now +x
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

  after((done) => {
    myPeriod.remove()
      .then(() => {
        return myUser.remove();
      })
      .then(() => {
        return Promise.all([
          myCandidateA.remove(),
          myCandidateB.remove()
        ]);
      })
      .then(() => {
        return myPeasant.remove();
      })
      .then(() => {
        done();
      });
  });

});
