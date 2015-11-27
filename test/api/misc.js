'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var fetch = require('node-fetch');
var url = utils.url;

describe('API', () => {

  it('GET /api/dummy', () => {
    return fetch(url + 'dummy')
      .then((res) => {
        expect(res.ok).to.be.false;
        expect(res.status).to.equal(404);
      });
  });

});
