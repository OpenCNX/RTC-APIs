const util = require('util');
const fetch = require('node-fetch');
const DEBUG = require('debug');
const {parseString} = require('xml2js');
const parseStringPromise = util.promisify(parseString);
const pkg = require('../package');
const debug = DEBUG(`${pkg.name}:debug`);

const get = (url) => {
  debug(`HTTP Get: ${url}`);
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
  debug,
};