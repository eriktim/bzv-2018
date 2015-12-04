'use strict';

var moment = require('moment');
var Period = require('../model/period');

var reqToPeriod = function(req, period) {
  period.year = req.body.year;
  period.start = req.body.start;
  period.end = req.body.end;
  period.reference = req.body.reference;
  period.numberOfVotes = req.body.numberOfVotes;
  period.updated = moment();
};

exports.bind = function(router) {

  router.route('/period')
    .post((req, res) => {
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
      var period = new Period();
      reqToPeriod(req, period);
      period.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(period, 201);
      });
    })
    .get((req, res) => {
      Period.find({year: req.user.year}, (err, periods) => {
        if (err) {
          res.send(err);
        }
        res.json(periods);
      });
    });

  router.route('/period/:id')
    .get((req, res) => {
      Period.findById(req.params.id, (err, period) => {
        if (err) {
          res.send(err);
        }
        res.json(period);
      });
    })
    .put((req, res) => {
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
      Period.findById(req.params.id, (err, period) => {
        if (err) {
          res.send(err);
        }
        reqToPeriod(req, period);
        period.save((err) => {
          if (err) {
            res.send(err);
          }
          res.json(period);
        });
      });
    })
    .delete((req, res) => {
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
      Period.remove({
        _id: req.params.id
      }, (err) => {
        if (err) {
          res.send(err);
        }
        res.status(204).send();
      });
    });

};
