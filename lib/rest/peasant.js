'use strict';

var Peasant = require('../model/peasant');

exports.bind = function(router) {

  router.route('/peasant')
    .post((req, res) => {
      var peasant = new Peasant();
      peasant.name = req.body.name;
      peasant.year = req.body.year;
      peasant.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(peasant);
      });
    })
    .get((req, res) => {
      Peasant.find((err, peasants) => {
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
      Peasant.findById(req.params.id, (err, peasant) => {
        if (err) {
          res.send(err);
        }
        peasant.name = req.body.name;
        peasant.year = req.body.year;
        peasant.save((err) => {
          if (err) {
            res.send(err);
          }
          res.json(peasant);
        });
      });
    })
    .delete((req, res) => {
      Peasant.remove({
        _id: req.params.id
      }, (err) => {
        if (err) {
          res.send(err);
        }
        res.json({});
      });
    });

  router.use((req, res, next) => {
    res.status(404).json({message: 'not found', status: 404});
  });

};
