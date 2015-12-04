'use strict';

var moment = require('moment');
var User = require('../model/user');

var reqToUser = function(req, user) {
  user.year = req.body.year;
  user.name = req.body.name;
  user.email = req.body.email;
  user.hash = req.body.password;
  if (req.body.role) {
    user.role = req.body.role;
  }
  user.updated = moment();
};

exports.bind = function(router) {

  router.route('/user')
    .post((req, res) => {
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
      var user = new User();
      reqToUser(req, user);
      user.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(user, 201);
      });
    })
    .get((req, res) => {
      Promise.resolve()
        .then(() => {
          if (req.user.role != 'admin') {
            return User.findById(req.user._id);
          } else {
            return User.find({year: req.user.year});
          }
        })
        .then((userOrUsers) => {
          res.json(userOrUsers);
        })
        .catch((reason) => {
          console.error(reason);
          res.json({message: 'Internal server error'}, 500);
        });
    });

  router.route('/user/:id')
    .get((req, res) => {
      if (req.user.role != 'admin' && req.user._id != req.params.id) {
        return res.json({message: 'Invalid request'}, 403);
      }
      User.findById(req.params.id, (err, user) => {
        if (err) {
          res.send(err);
        }
        res.json(user);
      });
    })
    .put((req, res) => {
      if (req.user.role != 'admin' && req.user._id != req.params.id) {
        return res.json({message: 'Invalid request'}, 403);
      }
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
      if (req.user.role != 'admin' && req.user._id != req.params.id) {
        return res.json({message: 'Invalid request'}, 403);
      }
      User.remove({
        _id: req.params.id
      }, (err) => {
        if (err) {
          res.send(err);
        }
        res.status(204).send();
      });
    });

};
