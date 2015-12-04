'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var fetch = require('node-fetch');
var url = utils.url;

describe('User API', () => {

  var users;

  it('POST /api/user', () => {
    var data = {
      year: 2000,
      name: 'Foo',
      email: 'foo@bar.js',
      password: 'password',
      role: 'admin'
    };
    return fetch(url + 'user', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((user) => {
        expect(user._id).to.be.ok;
        expect(user.year).to.equal(2000);
        expect(user.name).to.equal('Foo');
        expect(user.email).to.equal('foo@bar.js');
        expect(user.hash).to.be.undefined;
        expect(user.password).to.be.undefined;
        expect(user.role).to.equal('admin');
        expect(user.updated).to.be.a('string');
      });
  });

  it('POST /api/user', () => {
    var data = {
      year: 2000,
      name: 'Bar',
      email: 'bar@foo.js',
      password: 'password'
      // no role
    };
    return fetch(url + 'user', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((user) => {
        expect(user._id).to.be.ok;
        expect(user.year).to.equal(2000);
        expect(user.name).to.equal('Bar');
        expect(user.email).to.equal('bar@foo.js');
        expect(user.hash).to.be.undefined;
        expect(user.password).to.be.undefined;
        expect(user.role).to.equal('user');
        expect(user.updated).to.be.a('string');
      });
  });

  it('GET /api/user', () => {
    return fetch(url + 'user', utils.get())
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((result) => {
        users = result;
        expect(users.length).to.equal(3);
        var admins = users.filter(user => user.role == 'admin');
        expect(admins.length).to.equal(2);
      });
  });

  it('PUT /api/user/:id', () => {
    var user = users[0];
    user.year = 1999;
    user.name = 'User';
    user.email = 'user@foo.bar';
    user.password = 'password';
    user.role = 'visitor';
    return fetch(url + 'user/' + user._id, utils.put(user))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((user) => {
        expect(user._id).to.be.ok;
        expect(user.year).to.equal(1999);
        expect(user.name).to.equal('User');
        expect(user.email).to.equal('user@foo.bar');
        expect(user.hash).to.be.undefined;
        expect(user.password).to.be.undefined;
        expect(user.role).to.equal('visitor');
        expect(user.updated).to.be.a('string');
      });
  });

  it('DELETE /api/user/:id', () => {
    var dels = [];
    users.forEach((user) => {
      var del = fetch(url + 'user/' + user._id, utils.delete())
        .then((res) => {
          expect(res.ok).to.be.true;
        });
      dels.push(del);
    });
    return Promise.all(dels);
  });

  it('GET /api/user', () => {
    return fetch(url + 'user', utils.get())
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((users) => {
        expect(users.length).to.equal(0);
      });
  });

});
