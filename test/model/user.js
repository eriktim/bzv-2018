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

  it('should create a User', (done) => {
    var user = {
      year: 2000,
      name: 'Foo',
      email: 'foo@bar.js',
      hash: '$hash',
      role: 'admin'
    };
    User.create(user, (err, user) => {
      expect(err).not.to.be.ok;
      expect(user.year).to.equal(2000);
      expect(user.name).to.equal('Foo');
      expect(user.email).to.equal('foo@bar.js');
      expect(user.hash).to.equal('$hash');
      expect(user.role).to.equal('admin');
      expect(user.updated).to.be.a('Date');
      done();
    });
  });

  it('should create another User', (done) => {
    var user = {
      year: 2000,
      name: 'Bar',
      email: 'bar@foo.js',
      hash: '$hash'
      // no role
    };
    User.create(user, (err, user) => {
      expect(err).not.to.be.ok;
      expect(user.year).to.equal(2000);
      expect(user.name).to.equal('Bar');
      expect(user.email).to.equal('bar@foo.js');
      expect(user.hash).to.equal('$hash');
      expect(user.role).to.equal('user');
      expect(user.updated).to.be.a('Date');
      done();
    });
  });

  it('should fail creating an invalid User', (done) => {
    var user = {
      year: 2000,
      name: 'Bar',
      email: 'no-email',
      hash: '$hash'
      // no role
    };
    User.create(user, (err) => {
      expect(err).to.be.ok;
      done();
    });
  });

  it('should fail creating another invalid User', (done) => {
    var user = {
      year: 2000,
      name: 'Bar',
      email: 'foo@bar.js',
      hash: '$hash',
      role: 'anonymous'
    };
    User.create(user, (err) => {
      expect(err).to.be.ok;
      done();
    });
  });

  it('should have Users', (done) => {
    User.find((err, users) => {
      expect(err).not.to.be.ok;
      expect(users.length).to.equal(2);
      done();
    });
  });

  it('should edit a User', (done) => {
    User.findOne((err, user) => {
      expect(err).not.to.be.ok;
      user.year = 1999;
      user.name = 'User';
      user.email = 'user@foo.bar';
      user.hash = '#hash';
      user.role = 'visitor';
      user.save((err, user) => {
        expect(err).not.to.be.ok;
        expect(user.year).to.equal(1999);
        expect(user.name).to.equal('User');
        expect(user.email).to.equal('user@foo.bar');
        expect(user.hash).to.equal('#hash');
        expect(user.role).to.equal('visitor');
        expect(user.updated).to.be.a('Date');
        done();
      });
    });
  });

  it('should delete all Users', (done) => {
    User.find().remove((err) => {
      expect(err).not.to.be.ok;
      done();
    });
  });

  it('should not have Users', (done) => {
    User.find((err, users) => {
      expect(err).not.to.be.ok;
      expect(users.length).to.equal(0);
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
          return user.remove();
        })
        .then(() => {
          done();
        });
    });

    it('should remove Users', (done) => {
      User.find().exec()
        .then((users) => {
          expect(users.length).to.equal(0);
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
