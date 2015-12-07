'use strict';

function initFetch(method, map) {
  var body;
  var headers = {};
  if (['POST', 'PUT'].indexOf(method) >= 0) {
    headers['content-type'] = 'application/x-www-form-urlencoded';
    var keyValues = Object.keys(map).map((key) => {
      var value = map[key];
      if (value) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(value);
      }
    }).filter(kv => !!kv);
    if (keyValues.length) {
      body = keyValues.join('&');
    }
  }
  var token = sessionStorage.getItem('token');
  if (token) {
    headers['x-access-token'] = token;
  }
  var init = {
    method: method,
    headers: headers
  };
  if (body) {
    init.body = body;
  }
  return init;
}

function parseJSON(res) {
  if (!res.ok) {
    throw new Error('request failed');
  }
  return res.json();
}

export function get(url, data) {
  return fetch(url, initFetch('GET', data))
    .then(parseJSON);
};

export function post(url, data) {
  return fetch(url, initFetch('POST', data))
    .then(parseJSON);
};
