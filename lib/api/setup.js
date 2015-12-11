'use strict';

var User = require('./user');

exports.bind = function(app) {

  app.get('/setup', (req, res) => {

    var status;
    User.findOne({role: 'admin'})
      .then((user) => {
        if (user) {
          status = 200;
          return user;
        }
        status = 201;
        return User.create({
          year: 0,
          name: 'root',
          email: 'root@bzv.js',
          hash: 'bzv',
          role: 'admin'
        });
      })
      .then((user) => {
        res.json(user, status);
      })
      .catch((reason) => {
        console.error(reason);
        res.json({message: 'Internal server error'}, 500);
      });

  });

};
