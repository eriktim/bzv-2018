'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var moment = require('moment');

var Candidate = require('../../lib/model/candidate');
var Peasant = require('../../lib/model/peasant');
var Period = require('../../lib/model/period');
var User = require('../../lib/model/user');
var Vote = require('../../lib/model/vote');

describe('Period Model', () => {

  it('should create a Period', () => {
    var period = {
      year: 2000,
      start: '2000-01-01',
      end: '2000-02-01',
      reference: '2000-03-01',
      numberOfVotes: 10
    };
    return Period.create(period)
      .then((period) => {
        expect(period.year).to.equal(2000);
        expect(period.start).to.eql(new Date('2000-01-01'));
        expect(period.end).to.eql(new Date('2000-02-01'));
        expect(period.reference).to.eql(new Date('2000-03-01'));
        expect(period.numberOfVotes).to.equal(10);
        expect(period.updated).to.be.a('Date');
      });
  });

  it('should create another Period', () => {
    var period = {
      year: 2000,
      start: '2000-02-01',
      end: '2000-03-01',
      numberOfVotes: 5
    };
    return Period.create(period)
      .then((period) => {
        expect(period.year).to.equal(2000);
        expect(period.start).to.eql(new Date('2000-02-01'));
        expect(period.end).to.eql(new Date('2000-03-01'));
        expect(period.reference).to.be.undefined;
        expect(period.numberOfVotes).to.equal(5);
        expect(period.updated).to.be.a('Date');
      });
  });

  it('should have Periods', () => {
    return Period.find()
      .then((periods) => {
        expect(periods.length).to.equal(2);
      });
  });

  it('should edit a Period', () => {
    return Period.findOne()
      .then((period) => {
        period.year = 1999;
        period.reference = new Date('2000-05-01');
        return period.save();
      })
      .then((period) => {
        expect(period.year).to.equal(1999);
        expect(period.reference).to.eql(new Date('2000-05-01'));
        expect(period.updated).to.be.a('Date');
      });
  });

  it('should delete all Periods', () => {
    return Period.remove();
  });

  it('should not have Periods', () => {
    return Period.find()
      .then((periods) => {
        expect(periods.length).to.equal(0);
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
          User.find(),
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
        return period.remove();
      });
    });

    it('should remove Periods', () => {
      return Period.find()
        .then((periods) => {
          expect(periods.length).to.equal(0);
        });
    });

    it('should remove Votes', () => {
      return Vote.find()
        .then((votes) => {
          expect(votes.length).to.equal(0);
        });
    });

    after(() => {
      Candidate.remove()
        .then(() => {
          return Promise.all([
            Peasant.remove(),
            User.remove()
          ]);
        });
    });

  });

  describe('should have restrictions', () => {

    var candidate;
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
        return Candidate.create({
          name: 'Candidate',
          peasant: peasant._id
        });
      })
      .then((res) => {
        candidate = res;
        return User.create({
          year: 2000,
          name: 'User',
          email: 'user@bzv.js',
          hash: 'password',
        });
      })
      .then((res) => {
        user = res;
        return Promise.all([
          Peasant.find(),
          Candidate.find(),
          User.find({role: 'user'})
        ]);
      })
      .then((values) => {
        expect(values[0].length).to.equal(1);
        expect(values[1].length).to.equal(1);
        expect(values[2].length).to.equal(1);
      });
    });

    it('should start before ending', () => {
      return Period.create({
        year: 2000,
        start: moment().add(1, 'day'),
        end: moment().subtract(1, 'day'),
        numberOfVotes: 1
      })
      .catch((reason) => {
        expect(reason.toString()).to.equal(
            'Error: period cannot end before starting');
      });
    });

    it('should end before its reference', () => {
      return Period.create({
        year: 2000,
        start: moment().subtract(1, 'day'),
        end: moment().add(1, 'day'),
        reference: moment(),
        numberOfVotes: 1
      })
      .catch((reason) => {
        expect(reason.toString()).to.equal(
            'Error: period cannot end before the reference');
      });
    });

    after(() => {
      return Candidate.remove()
        .then(() => {
          return Promise.all([
            Peasant.remove(),
            Period.remove(),
            User.remove()
          ]);
        });
    });

  });

});
