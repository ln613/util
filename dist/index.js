"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.admin = exports.api = exports.host = exports.isProd = exports.isDev = exports.port = exports.set = exports.get = exports.toLensPath = exports.diff = exports.isPrimitiveType = exports.toAbsDate = exports.toMonth = exports.toDate = exports.stringToPath = exports.isStringNumber = exports.replace = exports.toLowerDash = exports.toTitleCase = exports.split2 = exports.sortDesc = exports.sort = exports.addIndex = exports.getPropByProp = exports.getPropByName = exports.getNameById = exports.getPropById = exports.findByName = exports.findById = exports.findByProp = exports.isIn = exports.toSingleArray = exports.tap = void 0;

var _ramda = require("ramda");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g; // from lodash/fp

var reEscapeChar = /\\(\\)?/g; // from lodash/fp

var tap = function tap(x) {
  return (0, _ramda.tap)(console.log, (0, _ramda.isNil)(x) ? 'null' : x);
}; // array


exports.tap = tap;

var toSingleArray = function toSingleArray(arr) {
  return (0, _ramda.is)(Array, arr) ? arr : [arr];
};

exports.toSingleArray = toSingleArray;

var isIn = function isIn(arr) {
  return function (val) {
    return arr.some(function (item) {
      return val === item;
    });
  };
};

exports.isIn = isIn;

var findByProp = function findByProp(p) {
  return function (val) {
    return function (arr) {
      return (0, _ramda.find)(function (x) {
        return x[p] == val;
      }, arr || []);
    };
  };
};

exports.findByProp = findByProp;
var findById = findByProp('id');
exports.findById = findById;
var findByName = findByProp('name');
exports.findByName = findByName;

var getPropById = function getPropById(p) {
  return function (id) {
    return (0, _ramda.pipe)(findById(id), (0, _ramda.prop)(p));
  };
};

exports.getPropById = getPropById;
var getNameById = getPropById('name');
exports.getNameById = getNameById;

var getPropByName = function getPropByName(p) {
  return function (name) {
    return (0, _ramda.pipe)(findByName(name), (0, _ramda.prop)(p));
  };
};

exports.getPropByName = getPropByName;

var getPropByProp = function getPropByProp(p1, p2, val) {
  return (0, _ramda.pipe)(findByProp(p2)(val), (0, _ramda.prop)(p1));
};

exports.getPropByProp = getPropByProp;

var addIndex = function addIndex(p) {
  return function (arr) {
    return arr.map(function (x, i) {
      return _objectSpread(_defineProperty({}, p || 'id', i + 1), (0, _ramda.dissoc)([p || 'id'], x));
    });
  };
};

exports.addIndex = addIndex;
var sort = (0, _ramda.sort)(function (a, b) {
  return a - b;
});
exports.sort = sort;
var sortDesc = (0, _ramda.sort)(function (a, b) {
  return b - a;
});
exports.sortDesc = sortDesc;

var split2 = function split2(isCeil) {
  return function (arr) {
    return (0, _ramda.splitAt)((isCeil ? Math.ceil : Math.floor)(arr.length / 2), arr);
  };
}; // string


exports.split2 = split2;

var toTitleCase = function toTitleCase(s) {
  return s.replace(/\w\S*/g, function (t) {
    return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
  });
};

exports.toTitleCase = toTitleCase;

var toLowerDash = function toLowerDash(s) {
  return s.toLowerCase().replace(/ /g, '-');
};

exports.toLowerDash = toLowerDash;

var replace = function replace(s, params) {
  return params && (0, _ramda.is)(Object, params) ? (0, _ramda.reduce)(function (p, c) {
    return p.replace(new RegExp("{".concat(c, "}"), 'g'), params[c]);
  }, s, Object.keys(params)) : s;
};

exports.replace = replace;

var isStringNumber = function isStringNumber(s) {
  return !isNaN(+s);
};

exports.isStringNumber = isStringNumber;

var stringToPath = function stringToPath(s) {
  // from lodash/fp
  var result = [];
  s.replace(rePropName, function (match, number, quote, subString) {
    var v = quote ? subString.replace(reEscapeChar, '$1') : number || match;
    result.push(isStringNumber(v) ? +v : v);
  });
  return result;
}; // date


exports.stringToPath = stringToPath;

var toDate = function toDate(s) {
  var d = new Date(s);
  return "".concat(d.getMonth() + 1, "/").concat(d.getDate(), "/").concat(d.getFullYear());
};

exports.toDate = toDate;

var toMonth = function toMonth(s) {
  var d = new Date(s);
  return "".concat(d.getFullYear(), "/").concat(d.getMonth() + 1);
};

exports.toMonth = toMonth;

var toAbsDate = function toAbsDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}; // object


exports.toAbsDate = toAbsDate;
var isPrimitiveType = (0, _ramda.anyPass)([(0, _ramda.is)(Number), (0, _ramda.is)(String), (0, _ramda.is)(Boolean)]);
exports.isPrimitiveType = isPrimitiveType;

var diff = function diff(p) {
  return (0, _ramda.differenceWith)(function (a, b) {
    return isPrimitiveType(a) ? a === b : a[p || 'id'] === b[p || 'id'];
  });
};

exports.diff = diff;

var toLensPath = function toLensPath(p) {
  return (0, _ramda.lensPath)((0, _ramda.is)(String, p) ? stringToPath(p) : p);
};

exports.toLensPath = toLensPath;
var get = (0, _ramda.pipe)(toLensPath, _ramda.view);
exports.get = get;
var set = (0, _ramda.pipe)(toLensPath, _ramda.set); // env

exports.set = set;
var port = process.env.PORT || 3000;
exports.port = port;

var isDev = function isDev() {
  return process.env.NODE_ENV && isIn(['development', 'dev'])(process.env.NODE_ENV.toLowerCase());
};

exports.isDev = isDev;

var isProd = function isProd() {
  return process.env.NODE_ENV || isIn(['production', 'prod'])(process.env.NODE_ENV.toLowerCase());
};

exports.isProd = isProd;
var host = isDev() ? "http://localhost:".concat(port, "/") : '/';
exports.host = host;
var api = host + 'api/';
exports.api = api;
var admin = host + 'admin/';
exports.admin = admin;