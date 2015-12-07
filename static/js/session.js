'use strict';

import {post} from 'server.js';

var loggedIn;
var logInPromise = new Promise((resolve) => {
  loggedIn = resolve;
});

function logIn() {
  var data = {
    name: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value
  };
  post('api/authenticate', data)
    .then((data) => {
      var token = data.token;
      console.log('received token');
      sessionStorage.setItem('token', token);
      document.getElementById('auth-login').style.display = 'none';
      document.getElementById('auth-logout').style.display = 'block';
      loggedIn();
    })
    .catch((reason) => {
      console.error(reason);
      sessionStorage.removeItem('token');
      document.getElementById('auth-login').style.display = 'block';
      document.getElementById('auth-logout').style.display = 'none';
    });
}

function logOut() {
  sessionStorage.removeItem('token');
  window.location.reload();
}

var app = {
  onceLoggedIn: function() {
    return logInPromise;
  },
  render: function() {
    var buttonLogOut = document.getElementById('button-logout');
    buttonLogOut.addEventListener('click', logOut);
    var buttonLogIn = document.getElementById('button-login');
    buttonLogIn.addEventListener('click', logIn);
    logIn();
  }
};

export default app;
