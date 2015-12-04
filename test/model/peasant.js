'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var moment = require('moment');

var Candidate = require('../../lib/model/candidate');
var Peasant = require('../../lib/model/peasant');
var Period = require('../../lib/model/period');
var User = require('../../lib/model/user');
var Vote = require('../../lib/model/vote');

describe('Peasant Model', () => {

  it('should create a Peasant', () => {
    var peasant = {
      year: 2000,
      name: 'Foo'
    };
    return Peasant.create(peasant)
      .then((peasant) => {
        expect(peasant.year).to.equal(2000);
        expect(peasant.name).to.equal('Foo');
        expect(peasant.updated).to.be.a('Date');
      });
  });

  it('should create another Peasant', () => {
    var peasant = {
      year: 2000,
      name: 'Bar'
    };
    return Peasant.create(peasant)
      .then((peasant) => {
        expect(peasant.year).to.equal(2000);
        expect(peasant.name).to.equal('Bar');
        expect(peasant.updated).to.be.a('Date');
      });
  });

  it('should have Peasants', () => {
    return Peasant.find()
      .then((peasants) => {
        expect(peasants.length).to.equal(2);
      });
  });

  it('should edit a Peasant', () => {
    return Peasant.findOne()
      .then((peasant) => {
        peasant.year = 1999;
        peasant.name = 'Peasant';
        return peasant.save();
      })
      .then((peasant) => {
        expect(peasant.year).to.equal(1999);
        expect(peasant.name).to.equal('Peasant');
        expect(peasant.updated).to.be.a('Date');
      });
  });

  it('should delete all Peasants', () => {
    return Peasant.remove();
  });

  it('should not have Peasants', () => {
    return Peasant.find()
      .then((peasants) => {
        expect(peasants.length).to.equal(0);
      });
  });

  describe('should cleanup nicely', () => {

    var candidateA;
    var candidateB;
    var peasant;
    var period;
    var user;

    before(() => {
      var year = 2000;
      return Peasant.create({
        year: year,
        name: 'Peasant'
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
          hash: 'password',
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
          Peasant.find(),
          Candidate.find(),
          Period.find(),
          User.find({role: 'user'}),
          Vote.find()
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
      });
    });

    it('should remove Peasants', () => {
      return Peasant.find()
        .then((peasants) => {
          expect(peasants.length).to.equal(0);
        });
    });

    it('should remove Candidates', () => {
      return Candidate.find()
        .then((candidates) => {
          expect(candidates.length).to.equal(0);
        });
    });

    it('should remove Votes', () => {
      return Vote.find()
        .then((votes) => {
          expect(votes.length).to.equal(0);
        });
    });

    after(() => {
      return Promise.all([
        Period.remove(),
        User.remove()
      ]);
    });

  });

  describe('should have functionally correct methods', () => {

    var candidates = [];
    var peasant;

    before(() => {
      return Peasant.create({
        year: 2000,
        name: 'Peasant'
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
          }),
          Candidate.create({
            name: 'CandidateC',
            peasant: peasant._id,
            dropped: moment()
          })
        ]);
      })
      .then((values) => {
        candidates = values;
        expect(candidates.length).to.equal(3);
      });
    });

    it('getLove', () => {
      return peasant.getLove()
        .then((candidate) => {
          expect(candidate).to.be.undefined;
          candidates[0].dropped = moment();
          return candidates[0].save()
            .then(() => {
              return peasant.getLove();
            });
        })
        .then((candidate) => {
          expect(candidate._id.toString())
              .to.equal(candidates[1]._id.toString());
        });
    });

    after(() => {
      return Promise.all([
        Peasant.remove(),
        Candidate.remove()
      ]);
    });

  });

});
