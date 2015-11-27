'use strict';

var utils = require('../utils');
var expect = require('chai').expect;

var User = require('../../lib/model/user');

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

});
