'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var fetch = require('node-fetch');
var url = utils.url;

describe('Peasant API', () => {

  var peasants;

  it('POST /api/peasant', () => {
    var data = {
      year: 2000,
      name: 'Foo'
    };
    return fetch(url + 'peasant', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((peasant) => {
        expect(peasant._id).to.be.ok;
        expect(peasant.year).to.equal(2000);
        expect(peasant.name).to.equal('Foo');
        expect(peasant.updated).to.be.a('string');
      });
  });

  it('POST /api/peasant', () => {
    var data = {
      year: 2000,
      name: 'Bar'
    };
    return fetch(url + 'peasant', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((peasant) => {
        expect(peasant._id).to.be.ok;
        expect(peasant.year).to.equal(2000);
        expect(peasant.name).to.equal('Bar');
        expect(peasant.updated).to.be.a('string');
      });
  });

  it('GET /api/peasant', () => {
    return fetch(url + 'peasant')
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((result) => {
        peasants = result;
        expect(peasants.length).to.equal(2);
      });
  });

  it('PUT /api/peasant/:id', () => {
    var peasant = peasants[0];
    peasant.name = 'Peasant';
    return fetch(url + 'peasant/' + peasant._id, utils.put(peasant))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((peasant) => {
        expect(peasant._id).to.be.ok;
        expect(peasant.name).to.equal('Peasant');
        expect(peasant.updated).to.be.a('string');
      });
  });

  it('DELETE /api/peasant/:id', () => {
    var dels = [];
    peasants.forEach((peasant) => {
      var del = fetch(url + 'peasant/' + peasant._id, {method: 'DELETE'})
        .then((res) => {
          expect(res.ok).to.be.true;
        });
      dels.push(del);
    });
    return Promise.all(dels);
  });

  it('GET /api/peasant', () => {
    return fetch(url + 'peasant')
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((peasants) => {
        expect(peasants.length).to.equal(0);
      });
  });

});
