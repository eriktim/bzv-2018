'use strict';

var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var randomstring = require('randomstring');

var User = mongoose.model('User');

// do not preserve tokens on reboot
var secret = process.env.NODE_ENV != 'prod' ? 'staticDevSecret' : randomstring.generate();

exports.bind = function(router) {

  router.route('/authenticate')
    .options((req, res) => {
      res.send();
    })
    .post((req, res) => {
      var token = req.body.token ||
          req.query.token || req.headers['x-access-token'];
      if (token) {
        jwt.verify(token, secret, function(err, decoded) {
          if (err) {
            res.json({message: 'Invalid token'}, 403);
          } else {
            res.json({
              token: token
            });
          }
        });
        return;
      }
      User.findOne({
        email: req.body.email
      })
      .then((user) => {
        if (!user || !user.hasPassword(req.body.password)) {
          res.json({message: 'Authentication failed'}, 403);
        } else {
          var token = jwt.sign(user, secret, {
            expiresIn: '24h'
          });

          res.json({
            token: token
          });
        }
      });
    });

  router.use(function(req, res, next) {
    var token = req.body.token ||
        req.query.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({message: 'Invalid token'}, 403);
        } else {
          req.user = decoded['_doc'];
          next();
        }
      });
    } else {
      return res.json({message: 'No token provided'}, 403);
    }
  });

};
