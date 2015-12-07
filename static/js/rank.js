'use strict';

import {get} from 'server.js';

function render(selector) {
  var element = document.querySelector(selector);
  get('api/user')
    .then((users) => {
      var rows = users.map(user =>
          `<tr><td>${user.name}</td><td></td><td></td><td></td></tr>`).join('');
      var table = `<table class="u-full-width">
          <thead><tr><th>Naam</th><th>Punten</th>
          <th>Bonuspunten</th><th>Totaal</th></tr></thead>
          <tbody>${rows}</tbody></table>`;
      element.innerHTML = table;
    });
}

var app = {
  render: render
};

export default app;
