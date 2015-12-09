'use strict';

import {get} from 'server.js';

var element;
var peasants;
var candidates;
var periods;
var votes;

function renderPeasant(peasant) {
  var candidatesForPeasant =
      candidates.filter(c => c.peasant == peasant._id);
  var head = candidatesForPeasant.map(
      candidate => `<th>${candidate.name}</th>`);
  var thead = '<tr><th>&nbsp;</th>' + head.join('') + '</tr>';
  var rows = [];
  periods.forEach((period) => {
    var row = [`<td>${period.end}</td>`];
    candidatesForPeasant.forEach((candidate) => {
      var vote = votes.find(v => v.period == period._id &&
          v.candidate == candidate._id);
      if (!vote) {
        row.push('<td>-</td>');
        return;
      }
      row.push(`<td><span class="vote vote-${vote.type}">
          </span>(${vote.points})</td>`);
    });
    rows.push('<tr>' + row.join('') + '</tr>');
  });
  var tbody = rows.join('');
  var li = peasants.map(p => `<li>${p.name}</li>`).join('');
  var ul = `<ul>${li}</ul>`;
  element.innerHTML = `${ul}<table class="u-full-width"><thead>${thead}</thead>
      <tbody>${tbody}</tbody></table>`;
}

function render(selector) {
  element = document.querySelector(selector);
  Promise.all([
    get('api/peasant'),
    get('api/candidate'),
    get('api/period'),
    get('api/vote')
  ])
  .then((values) => {
    [peasants, candidates, periods, votes] = values;
    renderPeasant(peasants[0]);
  });
}

var app = {
  render: render
};

export default app;
