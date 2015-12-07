'use strict';

var moment = require('moment');
var Period = require('../model/period');
var Vote = require('../model/vote');

var reqToVote = function(req, vote) {
  vote.candidate = req.body.candidate;
  vote.period = req.body.period;
  vote.user = req.body.user;
  vote.type = req.body.type;
  vote.updated = moment();
};

exports.bind = function(router) {

  router.route('/vote')
    .post((req, res) => {
      if (req.body.user != req.user._id) {
        return res.json({message: 'Invalid request'}, 403);
      }
      var vote = new Vote();
      reqToVote(req, vote);
      vote.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(vote, 201);
      });
    })
    .get((req, res) => {
      Promise.resolve()
        .then(() => {
          if (req.user.role == 'admin') {
            return Period.find({year: req.user.year})
              .then((periods) => {
                var ids = periods.map(period => period._id);
                return {period: {$in: ids}};
              });
          } else {
            return {user: req.user._id};
          }
        })
        .then((query) => {
          Vote.find(query, (err, votes) => {
            if (err) {
              res.send(err);
            }
            res.json(votes);
          });
        });
    });

  router.route('/vote/:id')
    .get((req, res) => {
      Vote.findById(req.params.id, (err, vote) => {
        if (err) {
          res.send(err);
        }
        res.json(vote);
      });
    })
    .put((req, res) => {
      Vote.findById(req.params.id, (err, vote) => {
        if (err) {
          res.send(err);
        }
        if (vote.user != req.user._id) {
          return res.json({message: 'Invalid request'}, 403);
        }
        reqToVote(req, vote);
        vote.save((err) => {
          if (err) {
            res.send(err);
          }
          res.json(vote);
        });
      });
    })
    .delete((req, res) => {
      Vote.remove({
        _id: req.params.id,
        user: req.user._id
      }, (err) => {
        if (err) {
          res.send(err);
        }
        res.status(204).send();
      });
    });

};
