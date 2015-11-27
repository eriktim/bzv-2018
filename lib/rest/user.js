'use strict';

var User = require('../model/user');

var reqToUser = function(req, user) {
  user.year = req.body.year;
  user.name = req.body.name;
  user.email = req.body.email;
  user.hash = req.body.hash;
  if (req.body.role) {
    user.role = req.body.role;
  }
};

exports.bind = function(router) {

  router.route('/user')
    .post((req, res) => {
      var user = new User();
      reqToUser(req, user);
      user.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(user);
      });
    })
    .get((req, res) => {
      User.find((err, users) => {
        if (err) {
          res.send(err);
        }
        res.json(users);
      });
    });

  router.route('/user/:id')
    .get((req, res) => {
      User.findById(req.params.id, (err, user) => {
        if (err) {
          res.send(err);
        }
        res.json(user);
      });
    })
    .put((req, res) => {
      User.findById(req.params.id, (err, user) => {
        if (err) {
          res.send(err);
        }
        reqToUser(req, user);
        user.save((err) => {
          if (err) {
            res.send(err);
          }
          res.json(user);
        });
      });
    })
    .delete((req, res) => {
      User.remove({
        _id: req.params.id
      }, (err) => {
        if (err) {
          res.send(err);
        }
        res.json({});
      });
    });

};
