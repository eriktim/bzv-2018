'use strict';

var moment = require('moment');
var Candidate = require('../model/candidate');

var reqToCandidate = function(req, candidate) {
  candidate.name = req.body.name;
  candidate.peasant = req.body.peasant;
  candidate.dropped = req.body.dropped;
  candidate.updated = moment();
};

exports.bind = function(router) {

  router.route('/candidate')
    .post((req, res) => {
      var candidate = new Candidate();
      reqToCandidate(req, candidate);
      candidate.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(candidate);
      });
    })
    .get((req, res) => {
      Candidate.find((err, candidates) => {
        if (err) {
          res.send(err);
        }
        res.json(candidates);
      });
    });

  router.route('/candidate/:id')
    .get((req, res) => {
      Candidate.findById(req.params.id, (err, candidate) => {
        if (err) {
          res.send(err);
        }
        res.json(candidate);
      });
    })
    .put((req, res) => {
      Candidate.findById(req.params.id, (err, candidate) => {
        if (err) {
          res.send(err);
        }
        reqToCandidate(req, candidate);
        candidate.save((err) => {
          if (err) {
            res.send(err);
          }
          res.json(candidate);
        });
      });
    })
    .delete((req, res) => {
      Candidate.remove({
        _id: req.params.id
      }, (err) => {
        if (err) {
          res.send(err);
        }
        res.json({});
      });
    });

};
