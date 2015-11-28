'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var fetch = require('node-fetch');
var url = utils.url;

describe('Vote API', () => {

  var votes;
  var myPeasant;
  var myCandidateA;
  var myCandidateB;
  var myPeriod;
  var myUser;

  before(() => {
    var year = 2000;
    var peasant = {
      year: year,
      name: 'Peasant'
    };
    var candidateA = {
      name: 'CandidateA'
    };
    var candidateB = {
      name: 'CandidateB'
    };
    var user = {
      year: year,
      name: 'User',
      email: 'user@bzv.js',
      hash: '$hash',
      role: 'user'
    };
    var period = {
      year: year,
      start: '2000-01-01',
      end: '2000-02-01',
      numberOfVotes: 3
    };
    return fetch(url + 'peasant', utils.post(peasant))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      })
      .then((peasant) => {
        expect(peasant._id).to.be.ok;
        myPeasant = peasant;
        candidateA.peasant = peasant._id;
        candidateB.peasant = peasant._id;
        return Promise.all([
          fetch(url + 'candidate', utils.post(candidateA)),
          fetch(url + 'candidate', utils.post(candidateB))
        ]);
      })
      .then((values) => {
        var resA = values.shift();
        var resB = values.shift();
        expect(resA.ok).to.be.true;
        expect(resB.ok).to.be.true;
        return Promise.all([
          resA.json(),
          resB.json()
        ]);
      })
      .then((values) => {
        myCandidateA = values.shift();
        myCandidateB = values.shift();
        return fetch(url + 'user', utils.post(user));
      })
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      })
      .then((user) => {
        myUser = user;
        return fetch(url + 'period', utils.post(period));
      })
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      })
      .then((period) => {
        myPeriod = period;
      });
  });

  it('POST /api/vote', () => {
    var data = {
      candidate: myCandidateA._id,
      period: myPeriod._id,
      user: myUser._id,
      type: 'love'
    };
    return fetch(url + 'vote', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((vote) => {
        expect(vote._id).to.be.ok;
        expect(vote.candidate).to.equal(myCandidateA._id);
        expect(vote.period).to.equal(myPeriod._id);
        expect(vote.user).to.equal(myUser._id);
        expect(vote.type).to.equal('love');
        expect(vote.updated).to.be.a('string');
      });
  });

  it('POST /api/vote', () => {
    var data = {
      candidate: myCandidateB._id,
      period: myPeriod._id,
      user: myUser._id,
      type: 'good'
    };
    return fetch(url + 'vote', utils.post(data))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((vote) => {
        expect(vote._id).to.be.ok;
        expect(vote.candidate).to.equal(myCandidateB._id);
        expect(vote.period).to.equal(myPeriod._id);
        expect(vote.user).to.equal(myUser._id);
        expect(vote.type).to.equal('good');
        expect(vote.updated).to.be.a('string');
      });
  });

  it('GET /api/vote', () => {
    return fetch(url + 'vote')
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((result) => {
        votes = result;
        expect(votes.length).to.equal(2);
      });
  });

  it('PUT /api/vote/:id', () => {
    var vote = votes[0];
    vote.type = 'bad';
    return fetch(url + 'vote/' + vote._id, utils.put(vote))
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((vote) => {
        expect(vote._id).to.be.ok;
        expect(vote.type).to.equal('bad');
        expect(vote.updated).to.be.a('string');
      });
  });

  it('DELETE /api/vote/:id', () => {
    var dels = [];
    votes.forEach((vote) => {
      var del = fetch(url + 'vote/' + vote._id, {method: 'DELETE'})
        .then((res) => {
          expect(res.ok).to.be.true;
        });
      dels.push(del);
    });
    return Promise.all(dels);
  });

  it('GET /api/peasant', () => {
    return fetch(url + 'vote')
      .then((res) => {
        expect(res.ok).to.be.true;
        return res.json();
      }).then((votes) => {
        expect(votes.length).to.equal(0);
      });
  });

  after(() => {
    return fetch(url + 'period/' + myPeriod._id, {method: 'DELETE'})
      .then((res) => {
        expect(res.ok).to.be.true;
        return fetch(url + 'user/' + myUser._id, {method: 'DELETE'});
      })
      .then((res) => {
        expect(res.ok).to.be.true;
        return Promise.all([
          fetch(url + 'candidate/' + myCandidateA._id, {method: 'DELETE'}),
          fetch(url + 'candidate/' + myCandidateB._id, {method: 'DELETE'})
        ]);
      })
      .then((values) => {
        expect(values[0].ok).to.be.true;
        expect(values[1].ok).to.be.true;
        return fetch(url + 'peasant/' + myPeasant._id, {method: 'DELETE'});
      })
      .then((res) => {
        expect(res.ok).to.be.true;
      });
  });

});
