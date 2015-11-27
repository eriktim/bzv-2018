'use strict';

var utils = require('../utils');
var expect = require('chai').expect;

var Candidate = require('../../lib/model/candidate');
var Peasant = require('../../lib/model/peasant');

describe('Candidate Model', () => {

  var myPeasant;

  before((done) => {
    var peasant = {
      year: 2000,
      name: 'Peasant'
    };
    Peasant.create(peasant, (err, peasant) => {
      expect(err).not.to.be.ok;
      expect(peasant._id).to.be.ok;
      myPeasant = peasant;
      done();
    });
  });

  it('should create a Candidate', (done) => {
    var candidate = {
      year: 2000,
      name: 'Foo',
      peasant: myPeasant._id
    };
    Candidate.create(candidate, (err, candidate) => {
      expect(err).not.to.be.ok;
      expect(candidate.year).to.equal(2000);
      expect(candidate.name).to.equal('Foo');
      expect(candidate.peasant).to.equal(myPeasant._id);
      expect(candidate.updated).to.be.a('Date');
      done();
    });
  });

  it('should create another Candidate', (done) => {
    var candidate = {
      year: 2000,
      name: 'Bar',
      peasant: myPeasant._id
    };
    Candidate.create(candidate, (err, candidate) => {
      expect(err).not.to.be.ok;
      expect(candidate.year).to.equal(2000);
      expect(candidate.name).to.equal('Bar');
      expect(candidate.peasant).to.equal(myPeasant._id);
      expect(candidate.updated).to.be.a('Date');
      done();
    });
  });

  it('should have Candidates', (done) => {
    Candidate.find((err, candidates) => {
      expect(err).not.to.be.ok;
      expect(candidates.length).to.equal(2);
      done();
    });
  });

  it('should edit a Candidate', (done) => {
    Candidate.findOne((err, candidate) => {
      expect(err).not.to.be.ok;
      candidate.year = 1999;
      candidate.name = 'Candidate';
      candidate.save((err, candidate) => {
        expect(err).not.to.be.ok;
        expect(candidate.year).to.equal(1999);
        expect(candidate.name).to.equal('Candidate');
        expect(candidate.updated).to.be.a('Date');
        done();
      });
    });
  });

  it('should delete all Candidates', (done) => {
    Candidate.find().remove((err) => {
      expect(err).not.to.be.ok;
      done();
    });
  });

  it('should not have Candidates', (done) => {
    Candidate.find((err, candidates) => {
      expect(err).not.to.be.ok;
      expect(candidates.length).to.equal(0);
      done();
    });
  });

  after((done) => {
    myPeasant.remove((err) => {
      expect(err).not.to.be.ok;
      done();
    });
  });

});
