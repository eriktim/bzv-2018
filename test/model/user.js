'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var moment = require('moment');

var Candidate = require('../../lib/model/candidate');
var Peasant = require('../../lib/model/peasant');
var Period = require('../../lib/model/period');
var User = require('../../lib/model/user');
var Vote = require('../../lib/model/vote');

describe('User Model', () => {

  it('should create a User', () => {
    var user = {
      year: 2000,
      name: 'Foo',
      email: 'foo@bar.js',
      hash: 'password',
      role: 'admin'
    };
    return User.create(user)
      .then((user) => {
        expect(user.year).to.equal(2000);
        expect(user.name).to.equal('Foo');
        expect(user.email).to.equal('foo@bar.js');
        expect(user.hash).to.match(/^\$2[ayb]\$.{56}$/);
        expect(user.role).to.equal('admin');
        expect(user.updated).to.be.a('Date');
      });
  });

  it('should create another User', () => {
    var user = {
      year: 2000,
      name: 'Bar',
      email: 'bar@foo.js',
      hash: 'password'
      // no role
    };
    return User.create(user)
      .then((user) => {
        expect(user.year).to.equal(2000);
        expect(user.name).to.equal('Bar');
        expect(user.email).to.equal('bar@foo.js');
        expect(user.hash).to.match(/^\$2[ayb]\$.{56}$/);
        expect(user.role).to.equal('user');
        expect(user.updated).to.be.a('Date');
      });
  });

  it('should fail creating an invalid User', () => {
    var user = {
      year: 2000,
      name: 'Bar',
      email: 'no-email',
      hash: 'password'
      // no role
    };
    var failed = false;
    return User.create(user)
      .catch((reason) => {
        expect(reason.toString()).to.equal(
            'ValidationError: Path `email` is invalid (no-email).');
        failed = true;
      })
      .then(() => {
        expect(failed).to.be.true;
      });
  });

  it('should fail creating another invalid User', () => {
    var user = {
      year: 2000,
      name: 'Bar',
      email: 'foo@bar.js',
      hash: 'password',
      role: 'anonymous'
    };
    var failed = false;
    return User.create(user)
      .catch((reason) => {
        expect(reason.toString()).to.equal(
            'ValidationError: `anonymous` is not a ' +
            'valid enum value for path `role`.');
        failed = true;
      })
      .then(() => {
        expect(failed).to.be.true;
      });
  });

  it('should have Users', () => {
    return User.find()
      .then((users) => {
        expect(users.length).to.equal(2);
      });
  });

  it('should edit a User', () => {
    return User.findOne()
      .then((user) => {
        user.year = 1999;
        user.name = 'User';
        user.email = 'user@foo.bar';
        user.role = 'visitor';
        return user.save();
      })
      .then((user) => {
        expect(user.year).to.equal(1999);
        expect(user.name).to.equal('User');
        expect(user.email).to.equal('user@foo.bar');
        expect(user.hash).to.match(/^\$2[ayb]\$.{56}$/);
        expect(user.role).to.equal('visitor');
        expect(user.updated).to.be.a('Date');
      });
  });

  it('should delete all Users', () => {
    return User.remove();
  });

  it('should not have Users', () => {
    return User.find()
      .then((users) => {
        expect(users.length).to.equal(0);
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
        return user.remove();
      });
    });

    it('should remove Users', () => {
      return User.find()
        .then((users) => {
          expect(users.length).to.equal(0);
        });
    });

    it('should remove Votes', () => {
      return Vote.find()
        .then((votes) => {
          expect(votes.length).to.equal(0);
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

  describe('should have functionally correct methods', () => {

    var user;

    before(() => {
      return User.create({
        year: 2000,
        name: 'User',
        email: 'user@bzv.js',
        hash: 'correct-password'
      })
      .then((res) => {
        user = res;
      });
    });

    it('hasPassword', () => {
      return user.hasPassword('correct-password')
        .then((res) => {
          expect(res).to.be.true;
          return user.hasPassword('incorrect-password');
        })
        .then((res) => {
          expect(res).to.be.false;
        });
    });

    after(() => {
      return User.remove();
    });

  });

});
