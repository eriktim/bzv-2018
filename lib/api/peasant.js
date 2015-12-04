'use strict';

var moment = require('moment');
var Peasant = require('../model/peasant');

var reqToPeasant = function(req, peasant) {
  peasant.year = req.body.year;
  peasant.name = req.body.name;
  peasant.updated = moment();
};

exports.bind = function(router) {

  router.route('/peasant')
    .post((req, res) => {
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
      var peasant = new Peasant();
      reqToPeasant(req, peasant);
      peasant.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(peasant, 201);
      });
    })
    .get((req, res) => {
      Peasant.find({year: req.user.year}, (err, peasants) => {
        if (err) {
          res.send(err);
        }
        res.json(peasants);
      });
    });

  router.route('/peasant/:id')
    .get((req, res) => {
      Peasant.findById(req.params.id, (err, peasant) => {
        if (err) {
          res.send(err);
        }
        res.json(peasant);
      });
    })
    .put((req, res) => {
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
      Peasant.findById(req.params.id, (err, peasant) => {
        if (err) {
          res.send(err);
        }
        reqToPeasant(req, peasant);
        peasant.save((err) => {
          if (err) {
            res.send(err);
          }
          res.json(peasant);
        });
      });
    })
    .delete((req, res) => {
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
      Peasant.remove({
        _id: req.params.id
      }, (err) => {
        if (err) {
          res.send(err);
        }
        res.status(204).send();
      });
    });

};
