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
      expect(err).not.to.be.ok;
      expect(peasant.year).to.equal(2000);
      expect(peasant.name).to.equal('Foo');
      expect(peasant.updated).to.be.a('Date');
      done();
    });
  });

  it('should create another Peasant', (done) => {
    var peasant = {
      year: 2000,
      name: 'Bar'
    };
    Peasant.create(peasant, (err, peasant) => {
      expect(err).not.to.be.ok;
      expect(peasant.year).to.equal(2000);
      expect(peasant.name).to.equal('Bar');
      expect(peasant.updated).to.be.a('Date');
      done();
    });
  });

  it('should have Peasants', (done) => {
    Peasant.find((err, peasants) => {
      expect(err).not.to.be.ok;
      expect(peasants.length).to.equal(2);
      done();
    });
  });

  it('should edit a Peasant', (done) => {
    Peasant.findOne((err, peasant) => {
      expect(err).not.to.be.ok;
      peasant.name = 'Peasant';
      peasant.year = 1999;
      peasant.save((err, peasant) => {
        expect(err).not.to.be.ok;
        expect(peasant.year).to.equal(1999);
        expect(peasant.name).to.equal('Peasant');
        expect(peasant.updated).to.be.a('Date');
        done();
      });
    });
  });

  it('should delete all Peasants', (done) => {
    Peasant.find().remove((err) => {
      expect(err).not.to.be.ok;
      done();
    });
  });

  it('should not have Peasants', (done) => {
    Peasant.find((err, peasants) => {
      expect(err).not.to.be.ok;
      expect(peasants.length).to.equal(0);
      done();
    });
  });

});
