'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var fetch = require('node-fetch');
var url = utils.url;

describe('Period API', () => {

  var periods;

  it('POST /api/period', () => {
    var data = {
      year: 2000,
      start: '2000-01-01',
      end: '2000-02-01',
      reference: '2000-03-01',
      numberOfVotes: 10
    };
    return fetch(url + 'period', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((period) => {
        expect(period._id).to.be.ok;
        expect(period.year).to.equal(2000);
        expect(period.start).to.equal('2000-01-01T00:00:00.000Z');
        expect(period.end).to.equal('2000-02-01T00:00:00.000Z');
        expect(period.reference).to.equal('2000-03-01T00:00:00.000Z');
        expect(period.numberOfVotes).to.equal(10);
        expect(period.updated).to.be.a('string');
      });
  });

  it('POST /api/period', () => {
    var data = {
      year: 2000,
      start: '2000-02-01',
      end: '2000-03-01',
      numberOfVotes: 5
    };
    return fetch(url + 'period', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((period) => {
        expect(period._id).to.be.ok;
        expect(period.year).to.equal(2000);
        expect(period.start).to.equal('2000-02-01T00:00:00.000Z');
        expect(period.end).to.equal('2000-03-01T00:00:00.000Z');
        expect(period.reference).to.be.undefined;
        expect(period.numberOfVotes).to.equal(5);
        expect(period.updated).to.be.a('string');
      });
  });

  it('GET /api/period', () => {
    return fetch(url + 'period', utils.get())
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((result) => {
        periods = result;
        expect(periods.length).to.equal(2);
      });
  });

  it('PUT /api/period/:id', () => {
    var period = periods[0];
    period.reference = '2000-05-01';
    return fetch(url + 'period/' + period._id, utils.put(period))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((period) => {
        expect(period._id).to.be.ok;
        expect(period.reference).to.equal('2000-05-01T00:00:00.000Z');
        expect(period.updated).to.be.a('string');
      });
  });

  it('DELETE /api/period/:id', () => {
    var dels = [];
    periods.forEach((period) => {
      var del = fetch(url + 'period/' + period._id, utils.delete())
        .then((res) => {
          expect(res.ok).to.be.true;
        });
      dels.push(del);
    });
    return Promise.all(dels);
  });

  it('GET /api/period', () => {
    return fetch(url + 'period', utils.get())
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((periods) => {
        expect(periods.length).to.equal(0);
      });
  });

});
