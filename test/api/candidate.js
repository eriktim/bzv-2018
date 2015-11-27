'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var fetch = require('node-fetch');
var url = utils.url;

describe('Candidate API', () => {

  var candidates;
  var myPeasant;

  before(() => {
    var data = {
      year: 2000,
      name: 'Peasant'
    };
    return fetch(url + 'peasant', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      })
      .then((peasant) => {
        expect(peasant._id).to.be.ok;
        myPeasant = peasant;
      });
  });

  it('POST /api/candidate', () => {
    var data = {
      year: 2000,
      name: 'Foo',
      peasant: myPeasant._id
    };
    return fetch(url + 'candidate', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((candidate) => {
        expect(candidate.year).to.equal(2000);
        expect(candidate.name).to.equal('Foo');
        expect(candidate.peasant).to.equal(myPeasant._id);
        expect(candidate.updated).to.be.a('string');
      });
  });

  it('POST /api/candidate', () => {
    var data = {
      year: 2000,
      name: 'Bar',
      peasant: myPeasant._id
    };
    return fetch(url + 'candidate', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((candidate) => {
        expect(candidate.year).to.equal(2000);
        expect(candidate.name).to.equal('Bar');
        expect(candidate.peasant).to.equal(myPeasant._id);
        expect(candidate.updated).to.be.a('string');
      });
  });

  it('GET /api/candidate', () => {
    return fetch(url + 'candidate')
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((result) => {
        candidates = result;
        expect(candidates.length).to.equal(2);
      });
  });

  it('PUT /api/candidate/:id', () => {
    var candidate = candidates[0];
    candidate.name = 'Candidate';
    return fetch(url + 'candidate/' + candidate._id, utils.put(candidate))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((candidate) => {
        expect(candidate.year).to.equal(2000);
        expect(candidate.name).to.equal('Candidate');
        expect(candidate.updated).to.be.a('string');
      });
  });

  it('DELETE /api/candidate/:id', () => {
    var dels = [];
    candidates.forEach((candidate) => {
      var del = fetch(url + 'candidate/' + candidate._id, {method: 'DELETE'})
        .then((res) => {
          expect(res.ok).to.be.true;
        });
      dels.push(del);
    });
    return Promise.all(dels);
  });

  it('GET /api/peasant', () => {
    return fetch(url + 'candidate')
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((candidates) => {
        expect(candidates.length).to.equal(0);
      });
  });

  after(() => {
    return fetch(url + 'peasant/' + myPeasant._id, {method: 'DELETE'})
      .then((res) => {
        expect(res.ok).to.be.true;
      });
  });

});
