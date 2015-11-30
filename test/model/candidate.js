'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var moment = require('moment');

var Candidate = require('../../lib/model/candidate');
var Peasant = require('../../lib/model/peasant');
var Period = require('../../lib/model/period');
var User = require('../../lib/model/user');
var Vote = require('../../lib/model/vote');

describe('Candidate Model', () => {

  var myPeasant;

  before((done) => {
    var peasant = {
      year: 2000,
      name: 'Peasant'
    };
    Peasant.create(peasant, (err, peasant) => {
      expect(err).not.to.be.ok;
      expect(peasant._id).to.be.ok;
      myPeasant = peasant;
      done();
    });
  });

  it('should create a Candidate', (done) => {
    var candidate = {
      name: 'Foo',
      peasant: myPeasant._id
    };
    Candidate.create(candidate, (err, candidate) => {
      expect(err).not.to.be.ok;
      expect(candidate.name).to.equal('Foo');
      expect(candidate.peasant).to.equal(myPeasant._id);
      expect(candidate.updated).to.be.a('Date');
      done();
    });
  });

  it('should create another Candidate', (done) => {
    var candidate = {
      name: 'Bar',
      peasant: myPeasant._id
    };
    Candidate.create(candidate, (err, candidate) => {
      expect(err).not.to.be.ok;
      expect(candidate.name).to.equal('Bar');
      expect(candidate.peasant).to.equal(myPeasant._id);
      expect(candidate.updated).to.be.a('Date');
      done();
    });
  });

  it('should have Candidates', (done) => {
    Candidate.find((err, candidates) => {
      expect(err).not.to.be.ok;
      expect(candidates.length).to.equal(2);
      done();
    });
  });

  it('should edit a Candidate', (done) => {
    Candidate.findOne((err, candidate) => {
      expect(err).not.to.be.ok;
      candidate.year = 1999;
      candidate.name = 'Candidate';
      candidate.save((err, candidate) => {
        expect(err).not.to.be.ok;
        expect(candidate.year).to.equal(1999);
        expect(candidate.name).to.equal('Candidate');
        expect(candidate.updated).to.be.a('Date');
        done();
      });
    });
  });

  it('should delete all Candidates', (done) => {
    Candidate.find().remove((err) => {
      expect(err).not.to.be.ok;
      done();
    });
  });

  it('should not have Candidates', (done) => {
    Candidate.find((err, candidates) => {
      expect(err).not.to.be.ok;
      expect(candidates.length).to.equal(0);
      done();
    });
  });

  describe('should cleanup nicely', () => {

    var candidateA;
    var candidateB;
    var peasant;
    var period;
    var user;

    before((done) => {
      var year = 2000;
      Promise.resolve()
        .then(() => {
          return Peasant.remove();
        })
        .then(() => {
          return Peasant.create({
            year: year,
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
          return Period.create({
            year: year,
            start: moment().subtract(1, 'day'),
            end: moment().add(1, 'day'),
            numberOfVotes: 1
          });
        })
        .then((res) => {
          period = res;
          return User.create({
            year: year,
            name: 'User',
            email: 'user@bzv.js',
            hash: '$hash',
          });
        })
        .then((res) => {
          user = res;
          return Promise.all([
            Vote.create({
              candidate: candidateA._id,
              period: period._id,
              user: user._id,
              type: 'love'
            }),
            Vote.create({
              candidate: candidateB._id,
              period: period._id,
              user: user._id,
              type: 'bad'
            })
          ]);
        })
        .then((values) => {
          return Promise.all([
            Peasant.find().exec(),
            Candidate.find().exec(),
            Period.find().exec(),
            User.find().exec(),
            Vote.find().exec()
          ]);
        })
        .then((values) => {
          expect(values[0].length).to.equal(1);
          expect(values[1].length).to.equal(2);
          expect(values[2].length).to.equal(1);
          expect(values[3].length).to.equal(1);
          expect(values[4].length).to.equal(2);
        })
        .then(() => {
          return Promise.all([
            candidateA.remove(),
            candidateB.remove()
          ]);
        })
        .then(() => {
          done();
        });
    });

    it('should remove Candidates', (done) => {
      Candidate.find().exec()
        .then((candidates) => {
          expect(candidates.length).to.equal(0);
          done();
        });
    });

    it('should remove Votes', (done) => {
      Vote.find().exec()
        .then((votes) => {
          expect(votes.length).to.equal(0);
          done();
        });
    });

    after((done) => {
      return Promise.all([
        Peasant.find().remove().exec(),
        Period.find().remove().exec(),
        User.find().remove().exec()
      ])
      .then(() => {
        done();
      });
    });

  });

});
