"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  fetch: true,
  post: true
};
exports.post = exports.fetch = void 0;

var _util = require("./util");

Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _util[key];
    }
  });
});

// http
var fetch = function fetch(url) {
  return window.fetch(url).then(function (r) {
    return r.json();
  });
};

exports.fetch = fetch;

var post = function post(url, data) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return window.fetch(url, {
    method: 'post',
    mode: 'cors',
    body: JSON.stringify(data),
    headers: headers
  }).then(function (r) {
    return r.json();
  });
};

exports.post = post;