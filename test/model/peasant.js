'use strict';

var utils = require('../utils');
var expect = require('chai').expect;

var Candidate = require('../../lib/model/candidate');
var Peasant = require('../../lib/model/peasant');
var Period = require('../../lib/model/period');
var User = require('../../lib/model/user');
var Vote = require('../../lib/model/vote');

describe('Peasant Model', () => {

  it('should create a Peasant', (done) => {
    var peasant = {
      year: 2000,
      name: 'Foo'
    };
    Peasant.create(peasant, (err, peasant) => {
      expect(err).not.to.be.ok;
      expect(peasant.year).to.equal(2000);
      expect(peasant.name).to.equal('Foo');
      expect(peasant.updated).to.be.a('Date');
      done();
    });
  });

  it('should create another Peasant', (done) => {
    var peasant = {
      year: 2000,
      name: 'Bar'
    };
    Peasant.create(peasant, (err, peasant) => {
      expect(err).not.to.be.ok;
      expect(peasant.year).to.equal(2000);
      expect(peasant.name).to.equal('Bar');
      expect(peasant.updated).to.be.a('Date');
      done();
    });
  });

  it('should have Peasants', (done) => {
    Peasant.find((err, peasants) => {
      expect(err).not.to.be.ok;
      expect(peasants.length).to.equal(2);
      done();
    });
  });

  it('should edit a Peasant', (done) => {
    Peasant.findOne((err, peasant) => {
      expect(err).not.to.be.ok;
      peasant.year = 1999;
      peasant.name = 'Peasant';
      peasant.save((err, peasant) => {
        expect(err).not.to.be.ok;
        expect(peasant.year).to.equal(1999);
        expect(peasant.name).to.equal('Peasant');
        expect(peasant.updated).to.be.a('Date');
        done();
      });
    });
  });

  it('should delete all Peasants', (done) => {
    Peasant.find().remove((err) => {
      expect(err).not.to.be.ok;
      done();
    });
  });

  it('should not have Peasants', (done) => {
    Peasant.find((err, peasants) => {
      expect(err).not.to.be.ok;
      expect(peasants.length).to.equal(0);
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
            start: '2000-01-01',
            end: '2000-02-01',
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
          return peasant.remove();
        })
        .then(() => {
          done();
        });
    });

    it('should remove Peasants', (done) => {
      Peasant.find().exec()
        .then((peasants) => {
          expect(peasants.length).to.equal(0);
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
        Period.find().remove().exec(),
        User.find().remove().exec()
      ])
      .then(() => {
        done();
      });
    });

  });

});
