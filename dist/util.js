"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = exports.isPrimitiveType = exports.set = exports.get = exports.currentTime = exports.currentDate = exports.toAbsDate = exports.toMonth = exports.toDate = exports.stringToPath = exports.replace = exports.pad0e = exports.padEnd = exports.pad0s = exports.padStart = exports.isStringNumber = exports.escapeRegex = exports.toLowerDash = exports.toTitleCase = exports.shuffle = exports.swap = exports.addIndex = exports.split2 = exports.isIn = exports.toSingleArray = exports.sortBy = exports.sortDesc = exports.sort = exports.getPropByProp = exports.getPropByName = exports.getNameById = exports.getPropById = exports.findByName = exports.findById = exports.findByProp = exports.tap = exports.trynull = exports.serial = exports.pickOne = exports.use = exports.noneEmptyObject = exports.noneEmptyArray = exports.P = exports.N = exports.F = exports.T = exports.C = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _ramda = require("ramda");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g; // from lodash/fp

var reEscapeChar = /\\(\\)?/g; // from lodash/fp

var toLensPath = function toLensPath(p) {
  return (0, _ramda.lensPath)((0, _ramda.is)(String, p) ? stringToPath(p) : p);
}; // misc


var C = function C(c) {
  return function () {
    return c;
  };
};

exports.C = C;

var T = function T() {
  return true;
};

exports.T = T;

var F = function F() {
  return false;
};

exports.F = F;

var N = function N(p) {
  return (0, _ramda.pipe)(p, _ramda.not);
};

exports.N = N;
var P = Promise.resolve({});
exports.P = P;
var noneEmptyArray = (0, _ramda.both)((0, _ramda.is)(Array), N(_ramda.isEmpty));
exports.noneEmptyArray = noneEmptyArray;
var noneEmptyObject = (0, _ramda.both)((0, _ramda.is)(Object), N(_ramda.isEmpty));
exports.noneEmptyObject = noneEmptyObject;

var use = function use() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (f) {
    return f.apply(void 0, args);
  };
};

exports.use = use;

var pickOne = function pickOne(k, o) {
  return use(o && (o[k] || o['default']));
};

exports.pickOne = pickOne;

var serial = function serial(a, f) {
  return a.reduce(function (p, c) {
    return p.then(function (l) {
      return f(c).then(function (r) {
        return [].concat((0, _toConsumableArray2["default"])(l), [r]);
      });
    });
  }, Promise.resolve([]));
};

exports.serial = serial;

var trynull = function trynull(f) {
  try {
    return f();
  } catch (e) {
    return null;
  }
};

exports.trynull = trynull;

var tap = function tap(x) {
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (t) {
    return t;
  };
  var pred = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  if ((0, _ramda.is)(Function, pred) ? pred(x) : pred) {
    if (title) console.log("".concat(title, " - "), f(x));else console.log(f(x));
  }

  return x;
}; // array


exports.tap = tap;
var findByProp = (0, _ramda.curry)(function (p, val, arr) {
  return (0, _ramda.find)(function (x) {
    return x[p] == val;
  }, arr || []);
});
exports.findByProp = findByProp;
var findById = findByProp('id');
exports.findById = findById;
var findByName = findByProp('name');
exports.findByName = findByName;
var getPropById = (0, _ramda.curry)(function (p, id) {
  return (0, _ramda.pipe)(findById(id), (0, _ramda.prop)(p));
});
exports.getPropById = getPropById;
var getNameById = getPropById('name');
exports.getNameById = getNameById;
var getPropByName = (0, _ramda.curry)(function (p, name) {
  return (0, _ramda.pipe)(findByName(name), (0, _ramda.prop)(p));
});
exports.getPropByName = getPropByName;

var getPropByProp = function getPropByProp(p1, p2, val) {
  return (0, _ramda.pipe)(findByProp(p2)(val), (0, _ramda.prop)(p1));
};

exports.getPropByProp = getPropByProp;
var sort = (0, _ramda.sort)(function (a, b) {
  return a - b;
});
exports.sort = sort;
var sortDesc = (0, _ramda.sort)(function (a, b) {
  return b - a;
});
exports.sortDesc = sortDesc;
var sortBy = (0, _ramda.curry)(function (o, arr) {
  return (0, _ramda.sortWith)((0, _ramda.is)(String, o) ? [(0, _ramda.ascend)((0, _ramda.prop)(o))] : Object.entries(o).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return (v ? _ramda.descend : _ramda.ascend)((0, _ramda.prop)(k));
  }), arr);
});
exports.sortBy = sortBy;

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

var split2 = function split2(isCeil) {
  return function (arr) {
    return (0, _ramda.splitAt)((isCeil ? Math.ceil : Math.floor)(arr.length / 2), arr);
  };
};

exports.split2 = split2;

var addIndex = function addIndex(p) {
  return function (arr) {
    return arr.map(function (x, i) {
      return _objectSpread((0, _defineProperty2["default"])({}, p || 'id', i + 1), (0, _ramda.dissoc)([p || 'id'], x));
    });
  };
};

exports.addIndex = addIndex;
var swap = (0, _ramda.curry)(function (i1, i2, arr) {
  var t = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = t;
});
exports.swap = swap;

var shuffle = function shuffle(arr) {
  var i1 = arr.length;

  while (i1 !== 0) {
    i1--;
    var i2 = Math.floor(Math.random() * i1);
    swap(i1, i2, arr);
  }

  return arr;
}; // string


exports.shuffle = shuffle;

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

var escapeRegex = function escapeRegex(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

exports.escapeRegex = escapeRegex;

var isStringNumber = function isStringNumber(s) {
  return !isNaN(+s);
};

exports.isStringNumber = isStringNumber;
var padStart = (0, _ramda.curry)(function (s1, n, s) {
  return s.toString().padStart(n, s1);
});
exports.padStart = padStart;
var pad0s = padStart('0');
exports.pad0s = pad0s;
var padEnd = (0, _ramda.curry)(function (s1, n, s) {
  return s.toString().padEnd(n, s1);
});
exports.padEnd = padEnd;
var pad0e = padEnd('0');
exports.pad0e = pad0e;

var replace = function replace(s, params) {
  return params && (0, _ramda.is)(Object, params) ? (0, _ramda.reduce)(function (p, c) {
    return p.replace(new RegExp("{".concat(c, "}"), 'g'), params[c]);
  }, s, Object.keys(params)) : s;
};

exports.replace = replace;

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
  return use(new Date(s))(function (d) {
    return "".concat(d.getMonth() + 1, "/").concat(d.getDate(), "/").concat(d.getFullYear());
  });
};

exports.toDate = toDate;

var toMonth = function toMonth(s) {
  return use(new Date(s))(function (d) {
    return "".concat(d.getFullYear(), "/").concat(d.getMonth() + 1);
  });
};

exports.toMonth = toMonth;

var toAbsDate = function toAbsDate(d) {
  return new Date(d).toISOString().slice(0, 10);
};

exports.toAbsDate = toAbsDate;

var currentDate = function currentDate() {
  return use(new Date())(function (d) {
    return "".concat(d.getFullYear(), "-").concat(pad0s(2, d.getMonth() + 1), "-").concat(pad0s(2, d.getDate()));
  });
};

exports.currentDate = currentDate;

var currentTime = function currentTime() {
  return use(new Date())(function (d) {
    return "".concat(pad0s(2, d.getHours()), ":").concat(pad0s(2, d.getMinutes()), ":").concat(pad0s(2, d.getSeconds()));
  });
}; // object


exports.currentTime = currentTime;
var get = (0, _ramda.pipe)(toLensPath, _ramda.view);
exports.get = get;
var set = (0, _ramda.pipe)(toLensPath, _ramda.set);
exports.set = set;
var isPrimitiveType = (0, _ramda.anyPass)([(0, _ramda.is)(Number), (0, _ramda.is)(String), (0, _ramda.is)(Boolean)]);
exports.isPrimitiveType = isPrimitiveType;

var diff = function diff(p) {
  return (0, _ramda.differenceWith)(function (a, b) {
    return isPrimitiveType(a) ? a === b : a[p || 'id'] === b[p || 'id'];
  });
};

exports.diff = diff;