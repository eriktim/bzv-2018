'use strict';

var util = require('../util');

exports.bind = function(router) {

  router.route('/update')
    .get((req, res) => {
      if (req.user.role != 'admin') {
        return res.json({message: 'Invalid request'}, 403);
      }
      return util.update()
        .then((count) => {
          res.json({updated: count});
        })
        .catch((reason) => {
          console.error(reason);
          res.status(500).send();
        });
    });

};
