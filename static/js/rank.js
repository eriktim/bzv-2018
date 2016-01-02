'use strict';

import {get} from 'server.js';

function render(selector) {
  var element = document.querySelector(selector);
  get('api/user')
    .then((users) => {
      var userMaps = users.map(user => {
        return {
          name: user.name,
          points: user.points.points,
          bonusPoints: user.points.bonusPoints,
          noLoveBonus: user.points.noLoveBonus,
          totalPoints: user.points.totalPoints
        };
      });
      var rows = userMaps.sort((a, b) => a.totalPoints < b.totalPoints)
          .map(user => `<tr><td>${user.name}</td><td>${user.points}</td>
              <td>${user.bonusPoints}</td><td>${user.noLoveBonus}</td>
              <td>${user.totalPoints}</td></tr>`).join('');
      var table = `<table class="u-full-width">
          <thead><tr><th>Naam</th><th>Punten</th>
          <th>Liefde-bonus</th><th>Zonder liefde-bonus</th><th>Totaal</th></tr></thead>
          <tbody>${rows}</tbody></table>`;
      element.innerHTML = table;
    });
}

var app = {
  render: render
};

export default app;
