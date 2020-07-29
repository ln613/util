(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "ramda", "cheerio", "axios"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("ramda"), require("cheerio"), require("axios"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ramda, global.cheerio, global.axios);
    global.util = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ramda, _cheerio, _axios) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.extractUrl = _exports.extractHtml = _exports.post = _exports.fetch = _exports.admin = _exports.api = _exports.host = _exports.isProd = _exports.isDev = _exports.port = _exports.diff = _exports.isPrimitiveType = _exports.set = _exports.get = _exports.toAbsDate = _exports.toMonth = _exports.toDate = _exports.stringToPath = _exports.replace = _exports.isStringNumber = _exports.escapeRegex = _exports.toLowerDash = _exports.toTitleCase = _exports.shuffle = _exports.swap = _exports.addIndex = _exports.split2 = _exports.isIn = _exports.toSingleArray = _exports.sortBy = _exports.sortDesc = _exports.sort = _exports.getPropByProp = _exports.getPropByName = _exports.getNameById = _exports.getPropById = _exports.findByName = _exports.findById = _exports.findByProp = _exports.tap = _exports.serial = _exports.use = void 0;
  _cheerio = _interopRequireDefault(_cheerio);
  _axios = _interopRequireDefault(_axios);

  var _process;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  process && (process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0');
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g; // from lodash/fp

  var reEscapeChar = /\\(\\)?/g; // from lodash/fp

  var toLensPath = function toLensPath(p) {
    return (0, _ramda.lensPath)((0, _ramda.is)(String, p) ? stringToPath(p) : p);
  };

  var findzz = function findzz(r, z) {
    var zz = z.split(':');
    var o = r.find(zz[0]);
    if (o.length > 1 && zz.length > 1) return o.eq(zz[1]);
    return o;
  }; // misc


  var use = function use() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return function (f) {
      return f.apply(void 0, args);
    };
  };

  _exports.use = use;

  var serial = function serial(a, f) {
    return a.reduce(function (p, c) {
      return p.then(function (l) {
        return f(c).then(function (r) {
          return [].concat(_toConsumableArray(l), [r]);
        });
      });
    }, Promise.resolve([]));
  };

  _exports.serial = serial;

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


  _exports.tap = tap;
  var findByProp = (0, _ramda.curry)(function (p, val, arr) {
    return (0, _ramda.find)(function (x) {
      return x[p] == val;
    }, arr || []);
  });
  _exports.findByProp = findByProp;
  var findById = findByProp('id');
  _exports.findById = findById;
  var findByName = findByProp('name');
  _exports.findByName = findByName;
  var getPropById = (0, _ramda.curry)(function (p, id) {
    return (0, _ramda.pipe)(findById(id), (0, _ramda.prop)(p));
  });
  _exports.getPropById = getPropById;
  var getNameById = getPropById('name');
  _exports.getNameById = getNameById;
  var getPropByName = (0, _ramda.curry)(function (p, name) {
    return (0, _ramda.pipe)(findByName(name), (0, _ramda.prop)(p));
  });
  _exports.getPropByName = getPropByName;

  var getPropByProp = function getPropByProp(p1, p2, val) {
    return (0, _ramda.pipe)(findByProp(p2)(val), (0, _ramda.prop)(p1));
  };

  _exports.getPropByProp = getPropByProp;
  var sort = (0, _ramda.sort)(function (a, b) {
    return a - b;
  });
  _exports.sort = sort;
  var sortDesc = (0, _ramda.sort)(function (a, b) {
    return b - a;
  });
  _exports.sortDesc = sortDesc;
  var sortBy = (0, _ramda.curry)(function (o, arr) {
    return (0, _ramda.sortWith)((0, _ramda.is)(String, o) ? [(0, _ramda.ascend)((0, _ramda.prop)(o))] : Object.entries(o).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];

      return (v ? _ramda.descend : _ramda.ascend)((0, _ramda.prop)(k));
    }), arr);
  });
  _exports.sortBy = sortBy;

  var toSingleArray = function toSingleArray(arr) {
    return (0, _ramda.is)(Array, arr) ? arr : [arr];
  };

  _exports.toSingleArray = toSingleArray;

  var isIn = function isIn(arr) {
    return function (val) {
      return arr.some(function (item) {
        return val === item;
      });
    };
  };

  _exports.isIn = isIn;

  var split2 = function split2(isCeil) {
    return function (arr) {
      return (0, _ramda.splitAt)((isCeil ? Math.ceil : Math.floor)(arr.length / 2), arr);
    };
  };

  _exports.split2 = split2;

  var addIndex = function addIndex(p) {
    return function (arr) {
      return arr.map(function (x, i) {
        return _objectSpread(_defineProperty({}, p || 'id', i + 1), (0, _ramda.dissoc)([p || 'id'], x));
      });
    };
  };

  _exports.addIndex = addIndex;
  var swap = (0, _ramda.curry)(function (i1, i2, arr) {
    var t = arr[i1];
    arr[i1] = arr[i2];
    arr[i2] = t;
  });
  _exports.swap = swap;

  var shuffle = function shuffle(arr) {
    var i1 = arr.length;

    while (i1 !== 0) {
      i1--;
      var i2 = Math.floor(Math.random() * i1);
      swap(i1, i2, arr);
    }

    return arr;
  }; // string


  _exports.shuffle = shuffle;

  var toTitleCase = function toTitleCase(s) {
    return s.replace(/\w\S*/g, function (t) {
      return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
    });
  };

  _exports.toTitleCase = toTitleCase;

  var toLowerDash = function toLowerDash(s) {
    return s.toLowerCase().replace(/ /g, '-');
  };

  _exports.toLowerDash = toLowerDash;

  var escapeRegex = function escapeRegex(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  _exports.escapeRegex = escapeRegex;

  var isStringNumber = function isStringNumber(s) {
    return !isNaN(+s);
  };

  _exports.isStringNumber = isStringNumber;

  var replace = function replace(s, params) {
    return params && (0, _ramda.is)(Object, params) ? (0, _ramda.reduce)(function (p, c) {
      return p.replace(new RegExp("{".concat(c, "}"), 'g'), params[c]);
    }, s, Object.keys(params)) : s;
  };

  _exports.replace = replace;

  var stringToPath = function stringToPath(s) {
    // from lodash/fp
    var result = [];
    s.replace(rePropName, function (match, number, quote, subString) {
      var v = quote ? subString.replace(reEscapeChar, '$1') : number || match;
      result.push(isStringNumber(v) ? +v : v);
    });
    return result;
  }; // date


  _exports.stringToPath = stringToPath;

  var toDate = function toDate(s) {
    return use(new Date(s))(function (d) {
      return "".concat(d.getMonth() + 1, "/").concat(d.getDate(), "/").concat(d.getFullYear());
    });
  };

  _exports.toDate = toDate;

  var toMonth = function toMonth(s) {
    return use(new Date(s))(function (d) {
      return "".concat(d.getFullYear(), "/").concat(d.getMonth() + 1);
    });
  };

  _exports.toMonth = toMonth;

  var toAbsDate = function toAbsDate(d) {
    return new Date(d).toISOString().slice(0, 10);
  }; // object


  _exports.toAbsDate = toAbsDate;
  var get = (0, _ramda.pipe)(toLensPath, _ramda.view);
  _exports.get = get;
  var set = (0, _ramda.pipe)(toLensPath, _ramda.set);
  _exports.set = set;
  var isPrimitiveType = (0, _ramda.anyPass)([(0, _ramda.is)(Number), (0, _ramda.is)(String), (0, _ramda.is)(Boolean)]);
  _exports.isPrimitiveType = isPrimitiveType;

  var diff = function diff(p) {
    return (0, _ramda.differenceWith)(function (a, b) {
      return isPrimitiveType(a) ? a === b : a[p || 'id'] === b[p || 'id'];
    });
  }; // env


  _exports.diff = diff;
  var port = ((_process = process) === null || _process === void 0 ? void 0 : _process.env.PORT) || 3000;
  _exports.port = port;

  var isDev = function isDev() {
    var _process2;

    return ((_process2 = process) === null || _process2 === void 0 ? void 0 : _process2.env.NODE_ENV) && isIn(['development', 'dev'])(process.env.NODE_ENV.toLowerCase());
  };

  _exports.isDev = isDev;

  var isProd = function isProd() {
    var _process3;

    return ((_process3 = process) === null || _process3 === void 0 ? void 0 : _process3.env.NODE_ENV) ? true : isIn(['production', 'prod'])(process.env.NODE_ENV.toLowerCase());
  };

  _exports.isProd = isProd;
  var host = isDev() ? "http://localhost:".concat(port, "/") : '/';
  _exports.host = host;
  var api = host + 'api/';
  _exports.api = api;
  var admin = host + 'admin/'; // http

  _exports.admin = admin;

  var fetch = function fetch(url) {
    return window ? window.fetch(url).then(function (r) {
      return r.json();
    }) : _axios["default"].get(url).then(function (r) {
      return r.data;
    });
  };

  _exports.fetch = fetch;

  var post = function post(url, data) {
    var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return window ? window.fetch(url, {
      method: 'post',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: headers
    }).then(function (r) {
      return r.json();
    }) : _axios["default"].post(url, data, headers).then(function (r) {
      return r.data;
    });
  }; // html


  _exports.post = post;

  var extractHtml = function extractHtml(html, opt) {
    var o = {};

    var r = _cheerio["default"].load(html);

    opt.forEach(function (x) {
      o[x[1]] = r(x[0]).map(function (i, y) {
        // x[0] - root element(s), x[1] - output root object name
        var o1 = {};
        var r1 = r(r(x[0])[i]);
        x[2].forEach(function (z) {
          // z[0] - child element(s), z[1] - output property name, 
          var z0 = z[0] ? (0, _ramda.is)(String, z[0]) ? findzz(r1, z[0]) : z[0](r1) : r1; // child element(s) can be a cheerio func expecting root element

          var a1 = z0.length > 1; // is child element(s) an array?

          var a2 = (0, _ramda.is)(Array, z[2]); // is attr(s) an array?

          o1[z[1]] = a2 ? a1 ? z0.map(function (j, u) {
            return (0, _ramda.fromPairs)(z[2].map(function (w) {
              return [w[0], r(u).attr(w[1])];
            }));
          }).toArray() : (0, _ramda.fromPairs)(z[2].map(function (w) {
            return [w[0], z0.attr(w[1])];
          })) : a1 ? z0.map(function (j, u) {
            return z[2] ? r(u).attr(z[2]) : r(u).text();
          }).toArray() : z[2] ? z0.attr(z[2]) : z0.text();
        });
        return o1;
      }).toArray();
    });
    return o;
  };

  _exports.extractHtml = extractHtml;

  var extractUrl = function extractUrl(url, opt) {
    return _axios["default"].get(url).then(function (r) {
      return extractHtml(r.data, opt);
    });
  };

  _exports.extractUrl = extractUrl;
});