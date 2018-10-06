const util = require('util');
const fetch = require('node-fetch');
const {parseString} = require('xml2js');
const parseStringPromise = util.promisify(parseString);

const get = (url) => {
  const options = {method: 'GET', headers: {'Content-Type': 'application/json', timeout: 5 * 1000}};
  return fetch(url, options);
};

const post = (url, body) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json', timeout: 5 * 1000},
  };
  return fetch(url, options).then(response => response.text());
};

module.exports = {
  HTTP: {
    post, get,
  },
  XML: {
    parseStringPromise, parseString,
  },
};