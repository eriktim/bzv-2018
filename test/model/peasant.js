'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var Peasant = require('../../lib/model/peasant');

describe('Peasant Model', () => {

  it('should create a Peasant', (done) => {
    var peasant = {
      year: 2000,
      name: 'Foo'
    };
    Peasant.create(peasant, (err, peasant) => {
      expect(err).to.be.null;
      expect(peasant.year).to.equal(2000);
      expect(peasant.name).to.equal('Foo');
      done();
    });
  });

  it('should create another Peasant', (done) => {
    var peasant = {
      year: 2000,
      name: 'Bar'
    };
    Peasant.create(peasant, (err, peasant) => {
      expect(err).to.be.null;
      expect(peasant.year).to.equal(2000);
      expect(peasant.name).to.equal('Bar');
      done();
    });
  });

  it('should load Peasants', (done) => {
    Peasant.find((err, peasants) => {
      expect(err).to.be.null;
      expect(peasants.length).to.equal(2);
      done();
    });
  });

  it('should edit a Peasant', (done) => {
    Peasant.findOne((err, peasant) => {
      expect(err).to.be.null;
      peasant.name = 'Peasant';
      peasant.year = 1999;
      peasant.save((err, peasant) => {
        expect(err).to.be.null;
        expect(peasant.year).to.equal(1999);
        expect(peasant.name).to.equal('Peasant');
        done();
      });
    });
  });

  it('should delete all Peasants', (done) => {
    Peasant.find().remove((err) => {
      expect(err).to.be.null;
      done();
    });
  });

  it('should not have Peasants', (done) => {
    Peasant.find((err, peasants) => {
      expect(err).to.be.null;
      expect(peasants.length).to.equal(0);
      done();
    });
  });

});
