"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractUrl = exports.extractHtml = exports.makeApi = exports.res = exports.post = exports.fetch = exports.admin = exports.api = exports.host = exports.isProd = exports.isDev = exports.port = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _axios = _interopRequireDefault(require("axios"));

var _ramda = require("ramda");

var _util = require("./util");

var _db = require("./db");

var _process;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

process && (process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0');

var findzz = function findzz(r, z) {
  var zz = z.split(':');
  var o = r.find(zz[0]);
  if (o.length > 1 && zz.length > 1) return o.eq(zz[1]);
  return o;
}; // env


var port = ((_process = process) === null || _process === void 0 ? void 0 : _process.env.PORT) || 3000;
exports.port = port;

var isDev = function isDev() {
  var _process2;

  return ((_process2 = process) === null || _process2 === void 0 ? void 0 : _process2.env.NODE_ENV) && (0, _util.isIn)(['development', 'dev'])(process.env.NODE_ENV.toLowerCase());
};

exports.isDev = isDev;

var isProd = function isProd() {
  var _process3;

  return ((_process3 = process) === null || _process3 === void 0 ? void 0 : _process3.env.NODE_ENV) ? true : (0, _util.isIn)(['production', 'prod'])(process.env.NODE_ENV.toLowerCase());
};

exports.isProd = isProd;
var host = isDev() ? "http://localhost:".concat(port, "/") : '/';
exports.host = host;
var api = host + 'api/';
exports.api = api;
var admin = host + 'admin/'; // http

exports.admin = admin;

var fetch = function fetch(url) {
  return _axios["default"].get(url).then(function (r) {
    return r.data;
  });
};

exports.fetch = fetch;

var post = function post(url, data) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return _axios["default"].post(url, data, headers).then(function (r) {
    return r.data;
  });
};

exports.post = post;
var cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT,PATCH,DELETE,COPY,PURGE'
};

var res = function res(body, code) {
  return {
    statusCode: code || 200,
    headers: _objectSpread(_objectSpread({}, cors), {}, {
      //...(isDev ? cors : {}),
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body)
  };
};

exports.res = res;

var makeApi = function makeApi(opt) {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(event, context) {
      var q, body, method, r, t;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              context.callbackWaitsForEmptyEventLoop = false;
              q = event.queryStringParameters;
              body = (0, _util.trynull)(function (_) {
                return JSON.parse(event.body);
              });
              method = event.httpMethod.toLowerCase();
              r = {};
              _context.prev = 5;

              if (!(q.db == 1)) {
                _context.next = 9;
                break;
              }

              _context.next = 9;
              return (0, _db.connectDB)();

            case 9:
              t = (0, _util.get)("".concat(method, ".").concat(q.type))(opt);
              _context.t0 = t;

              if (!_context.t0) {
                _context.next = 15;
                break;
              }

              _context.next = 14;
              return t(q, body);

            case 14:
              r = _context.sent;

            case 15:
              return _context.abrupt("return", res((0, _ramda.isNil)(r) ? 'Done' : r));

            case 18:
              _context.prev = 18;
              _context.t1 = _context["catch"](5);
              (0, _util.tap)(_context.t1);
              return _context.abrupt("return", res(_context.t1, 500));

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[5, 18]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
}; // html


exports.makeApi = makeApi;

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

exports.extractHtml = extractHtml;

var extractUrl = function extractUrl(url, opt) {
  return _axios["default"].get(url).then(function (r) {
    return extractHtml(r.data, opt);
  });
};

exports.extractUrl = extractUrl;