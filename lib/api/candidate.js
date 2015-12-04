'use strict';

var moment = require('moment');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Candidate = require('../model/candidate');
var Peasant = require('../model/peasant');

var reqToCandidate = function(req, candidate) {
  candidate.name = req.body.name;
  candidate.peasant = req.body.peasant;
  candidate.dropped = req.body.dropped;
  candidate.updated = moment();
};

exports.bind = function(router) {

  router.route('/candidate')
    .post((req, res) => {
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
      var candidate = new Candidate();
      reqToCandidate(req, candidate);
      candidate.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(candidate, 201);
      });
    })
    .get((req, res) => {
      Peasant.find({year: req.user.year})
        .then((peasants) => {
          var ids = peasants.map(peasant => peasant._id);
          return Candidate.find({peasant: {$in: ids}});
        })
        .then((candidates) => {
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
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
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
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
      Candidate.remove({
        _id: req.params.id
      }, (err) => {
        if (err) {
          res.send(err);
        }
        res.status(204).send();
      });
    });

};
