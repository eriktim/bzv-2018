'use strict';

var utils = require('../utils');
var expect = require('chai').expect;

var Period = require('../../lib/model/period');

describe('Period Model', () => {

  it('should create a Period', (done) => {
    var period = {
      year: 2000,
      start: '2000-01-01',
      end: '2000-02-01',
      reference: '2000-03-01',
      numberOfVotes: 10
    };
    Period.create(period, (err, period) => {
      expect(err).not.to.be.ok;
      expect(period.year).to.equal(2000);
      expect(period.start).to.eql(new Date('2000-01-01'));
      expect(period.end).to.eql(new Date('2000-02-01'));
      expect(period.reference).to.eql(new Date('2000-03-01'));
      expect(period.numberOfVotes).to.equal(10);
      expect(period.updated).to.be.a('Date');
      done();
    });
  });

  it('should create another Period', (done) => {
    var period = {
      year: 2000,
      start: '2000-02-01',
      end: '2000-03-01',
      numberOfVotes: 5
    };
    Period.create(period, (err, period) => {
      expect(err).not.to.be.ok;
      expect(period.year).to.equal(2000);
      expect(period.start).to.eql(new Date('2000-02-01'));
      expect(period.end).to.eql(new Date('2000-03-01'));
      expect(period.reference).to.be.undefined;
      expect(period.numberOfVotes).to.equal(5);
      expect(period.updated).to.be.a('Date');
      done();
    });
  });

  it('should have Periods', (done) => {
    Period.find((err, periods) => {
      expect(err).not.to.be.ok;
      expect(periods.length).to.equal(2);
      done();
    });
  });

  it('should edit a Period', (done) => {
    Period.findOne((err, period) => {
      expect(err).not.to.be.ok;
      period.year = 1999;
      period.reference = new Date('2000-05-01');
      period.save((err, period) => {
        expect(err).not.to.be.ok;
        expect(period.year).to.equal(1999);
        expect(period.reference).to.eql(new Date('2000-05-01'));
        expect(period.updated).to.be.a('Date');
        done();
      });
    });
  });

  it('should delete all Periods', (done) => {
    Period.find().remove((err) => {
      expect(err).not.to.be.ok;
      done();
    });
  });

  it('should not have Periods', (done) => {
    Period.find((err, periods) => {
      expect(err).not.to.be.ok;
      expect(periods.length).to.equal(0);
      done();
    });
  });

});
