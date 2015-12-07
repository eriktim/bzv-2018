'use strict';

import session from 'session.js';
import rank from 'rank.js';
import votes from 'votes.js';

session.render();
session.onceLoggedIn()
  .then(() => {
    rank.render('#rank');
    votes.render('#votes');
  });
