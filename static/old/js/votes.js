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
  var thead = '<tr><th>&nbsp;</th>' + head.join('') +
      '<th><em>totaal</em></th></tr>';
  var rows = [];
  periods.forEach((period, idx) => {
    var row = [`<td>${period.end.substr(0, 10)}</td>`];
    var points = 0;
    candidatesForPeasant.forEach((candidate) => {
      if (candidate.dropped &&
          moment(period.start).isAfter(candidate.dropped)) {
        row.push('<td class="no-vote"></td>');
        return;
      }
      var vote = votes.find(v => v.period == period._id &&
          v.candidate == candidate._id);
      if (!vote) {
        row.push('<td>-</td>');
        return;
      }
      points += (vote.points || 0) + (vote.bonusPoints || 0);
      row.push(`<td><span class="vote vote-${vote.type}">
          </span>${vote.points > 0 ? '(' + vote.points +
          (vote.bonusPoints > 0 ? '+' + vote.bonusPoints : '') + ')' :
          (vote.noLoveBonus ? '(0 + ' + period.numberOfVotes + ')' : '')
          }</td>`);
    });
    var rowClass = '';
    var nextPeriod = periods[idx + 1];
    if (!nextPeriod || nextPeriod.reference != period.reference) {
      var className = `vote-reference vote-reference-${period.numberOfVotes}`;
      rowClass = ` class="${className}`;
    }
    rows.push(`<tr ${rowClass}">` +
        row.join('') + (`<td>${points}</td></tr>`));
  });
  var tbody = rows.join('');
  var buttons = peasants.map(p => `<button class="button
      ${p._id == peasant._id ? 'button-primary' : ''} peasant"
      id="${p._id}">${p.name}</button>`).join(' ');
  // TODO escape HTML
  element.innerHTML = `${buttons}<table class="votes u-full-width">
      <thead>${thead}</thead>
      <tbody>${tbody}</tbody></table>`;
  Array.from(document.querySelectorAll('.peasant')).forEach((el) => {
    var peasant = peasants.find(p => p._id == el.id);
    el.onclick = function() {
      renderPeasant(peasant);
    };
  });
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
