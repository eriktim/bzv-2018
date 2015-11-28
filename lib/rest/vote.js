'use strict';

var Vote = require('../model/vote');

var reqToVote = function(req, vote) {
  vote.candidate = req.body.candidate;
  vote.period = req.body.period;
  vote.user = req.body.user;
  vote.type = req.body.type;
  vote.numberOfVotes = req.body.numberOfVotes;
};

exports.bind = function(router) {

  router.route('/vote')
    .post((req, res) => {
      var vote = new Vote();
      reqToVote(req, vote);
      vote.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(vote);
      });
    })
    .get((req, res) => {
      Vote.find((err, votes) => {
        if (err) {
          res.send(err);
        }
        res.json(votes);
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
        _id: req.params.id
      }, (err) => {
        if (err) {
          res.send(err);
        }
        res.json({});
      });
    });

};
